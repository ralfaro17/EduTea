from djoser import email, utils
from djoser.conf import  settings
from django.contrib.auth.tokens import default_token_generator
from django.templatetags.static import static

class CustomActivationEmail(email.ActivationEmail):
    template_name = 'email/activation.html'

    def get_context_data(self):
        context = super().get_context_data()
        image_url = static('email/logo2.png')
        user = context.get('user')
        context['uid'] = utils.encode_uid(user.pk)
        context['token'] = default_token_generator.make_token(user)
        context['url'] = settings.ACTIVATION_URL.format(**context)
        context['image_url'] = image_url
        return context
