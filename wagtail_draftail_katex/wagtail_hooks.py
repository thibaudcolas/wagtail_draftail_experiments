from django.utils.html import format_html
from django.conf import settings

import wagtail.admin.rich_text.editors.draftail.features as draftail_features
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineStyleElementHandler
from wagtail.core import hooks

from .rich_text import KaTeXEntityElementHandler, katex_entity_decorator


@hooks.register('register_rich_text_features')
def register_rich_text_features(features):
    features.default_features.append('katex')
    """
    Registering the `katex` feature, which uses the `KATEX` Draft.js entity type,
    and is stored as HTML with a `<div data-katex-text="c = \\pm\\sqrt{a^2 + b^2}">` tag.
    """
    feature_name = 'katex'
    type_ = 'KATEX'

    control = {
        'type': type_,
        'label': '𝐊',
        'description': 'KaTeX',
    }

    features.register_editor_plugin(
        'draftail', feature_name, draftail_features.EntityFeature(control)
    )

    features.register_converter_rule('contentstate', feature_name, {
        # Note here that the conversion is more complicated than for blocks and inline styles.
        'from_database_format': {'div[data-katex-text]': KaTeXEntityElementHandler()},
        'to_database_format': {'entity_decorators': {type_: katex_entity_decorator}},
    })


@hooks.register('insert_editor_js')
def insert_editor_js():
    js_files = [
        # We require this file here to make sure it is loaded before the other.
        '%swagtailadmin/js/draftail.js' % settings.STATIC_URL,
        '%swagtail_draftail_katex.js' % settings.STATIC_URL,
    ]

    return format_html("""
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css" integrity="sha384-TEMocfGvRuD1rIAacqrknm5BQZ7W7uWitoih+jMNFXQIbNl16bO8OZmylH/Vi/Ei" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js" integrity="sha384-jmxIlussZWB7qCuB+PgKG1uLjjxbVVIayPJwi6cG6Zb4YKq0JIw+OMnkkEC7kYCq" crossorigin="anonymous"></script>
    <script src="{}"></script>
    <script src="{}"></script>
    """, js_files[0], js_files[1])
