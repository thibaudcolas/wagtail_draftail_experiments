from draftjs_exporter.dom import DOM
from wagtail.admin.rich_text.converters.contentstate_models import Entity
from wagtail.admin.rich_text.converters.html_to_contentstate import AtomicBlockEntityElementHandler


def katex_entity_decorator(props):
    """
    Draft.js ContentState to database HTML.
    Converts the KATEX entities into <div> tags.
    """
    return DOM.create_element('div', {
        'data-katex-text': props['text'],
    })


class KaTeXEntityElementHandler(AtomicBlockEntityElementHandler):
    """
    Database HTML to Draft.js ContentState.
    Converts the <div> tags into KATEX entities, with the right data.
    """
    # In Draft.js entity terms, anchors are "mutable".
    # We can alter the anchor's text, but it's still an anchor.
    mutability = 'MUTABLE'

    def create_entity(self, name, attrs, state, contentstate):
        return Entity('KATEX', 'IMMUTABLE', {
            'text': attrs['data-katex-text'],
        })
