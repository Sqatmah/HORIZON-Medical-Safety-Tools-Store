import json
import base64
from anthropic import Anthropic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings


class AnalyzeProductImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not getattr(request.user, 'is_admin_role', False):
            return Response({'error': 'غير مصرح'}, status=403)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'الصورة مطلوبة'}, status=400)

        image_b64 = base64.b64encode(image_file.read()).decode()
        client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        prompt = """حلل صورة المنتج الطبي/الوقائي هذه وأرجع JSON فقط (بدون أي نص إضافي) بالحقول التالية بالضبط:
{
  "name_en": "", "name_ar": "",
  "short_desc_en": "", "short_desc_ar": "",
  "desc_en": "", "desc_ar": "",
  "specs": [{"key_en": "", "key_ar": "", "value_en": "", "value_ar": ""}],
  "compliance_standard": "", "warranty_en": "", "warranty_ar": "",
  "suggested_price": 0
}"""

        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {
                        "type": "base64",
                        "media_type": image_file.content_type,
                        "data": image_b64
                    }},
                    {"type": "text", "text": prompt}
                ]
            }]
        )

        result_text = message.content[0].text
        # تنظيف احتياطي لو رجع النص محاط بـ ```json
        result_text = result_text.replace('```json', '').replace('```', '').strip()

        try:
            result = json.loads(result_text)
        except json.JSONDecodeError:
            return Response({'error': 'فشل تحليل رد الذكاء الاصطناعي', 'raw': result_text}, status=500)

        return Response(result)