from django.utils.html import format_html_join
from django.conf import settings

import wagtail.admin.rich_text.editors.draftail.features as draftail_features
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineStyleElementHandler
from wagtail.core import hooks

from .rich_text import StockEntityElementHandler, stock_entity_decorator


@hooks.register('register_rich_text_features')
def register_stock_feature(features):
    """
    Registering the `stock` feature, which uses the `STOCK` Draft.js entity type,
    and is stored as HTML with a `<span data-stock>` tag.
    """
    feature_name = 'stock'
    type_ = 'STOCK'

    stock_feature = draftail_features.EntityFeature({
        'type': type_,
        'icon': [
            'M1024 288v191.996c0 26.496-21.472 48-48 48-26.527 0-47.999-21.504-47.999-48V403.87L753.956 577.915c-18.752 18.751-49.12 18.751-67.871 0l-78.079-78.047-190.045 190.045c-18.752 18.752-49.12 18.752-67.871 0l-94.078-94.047L81.966 769.912c-18.751 18.751-49.151 18.751-67.903 0-18.751-18.752-18.751-49.12 0-67.871L222.06 494.044c18.752-18.752 49.12-18.752 67.871 0l94.079 94.079 190.045-190.045c18.751-18.752 49.119-18.752 67.87 0l78.015 78.046 140.19-140.126h-76.127c-26.527 0-47.999-21.503-47.999-47.999 0-26.495 21.472-47.999 48-47.999H976c26.528 0 48 21.504 48 48z',
        ],
        'description': 'Stock',
    })

    features.register_editor_plugin('draftail', feature_name, stock_feature)

    features.register_converter_rule('contentstate', feature_name, {
        # Note here that the conversion is more complicated than for blocks and inline styles.
        'from_database_format': {'span[data-stock]': StockEntityElementHandler(type_)},
        'to_database_format': {'entity_decorators': {type_: stock_entity_decorator}},
    })

    features.default_features.append(feature_name)


@hooks.register('insert_editor_js')
def stock_editor_js():
    js_files = [
        'wagtailadmin/js/draftail.js',
        'wagtail_draftail_stock.js',
    ]
    js_includes = format_html_join('\n', '<script src="{0}{1}"></script>',
        ((settings.STATIC_URL, filename) for filename in js_files)
    )
    return js_includes
