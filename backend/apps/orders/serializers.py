from decimal import Decimal
from rest_framework import serializers
from .models import Order
from apps.products.models import Product

VAT_RATE = Decimal('0.15')  # 15%


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = [
            'order_number', 'user', 'subtotal', 'vat_amount', 'total',
        ]

    def create(self, validated_data):
        items = validated_data.get('items', [])
        subtotal = Decimal('0')

        # نعيد حساب السعر من قاعدة البيانات الحقيقية، مش من اللي بعته العميل
        verified_items = []
        for item in items:
            product = Product.objects.get(id=item['product_id'])
            price = product.discount_price or product.price
            quantity = int(item.get('quantity', 1))
            subtotal += price * quantity
            verified_items.append({
                'product_id': product.id,
                'name_en': product.name_en,
                'name_ar': product.name_ar,
                'price': str(price),
                'quantity': quantity,
                'variant': item.get('variant', ''),
                'image': product.images.first().image.url if product.images.exists() else '',
            })

        shipping_cost = validated_data.get('shipping_cost', Decimal('0'))
        discount_amount = validated_data.get('discount_amount', Decimal('0'))

        taxable_amount = subtotal + shipping_cost - discount_amount
        vat_amount = (taxable_amount * VAT_RATE).quantize(Decimal('0.01'))
        total = taxable_amount + vat_amount

        validated_data['items'] = verified_items
        validated_data['subtotal'] = subtotal
        validated_data['vat_amount'] = vat_amount
        validated_data['total'] = total

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user

        return super().create(validated_data)