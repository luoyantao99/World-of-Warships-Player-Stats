from django import template
register = template.Library()

@register.filter(name='format_time')
def format_time(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    return f"{hours}h {minutes}m {seconds}s"
