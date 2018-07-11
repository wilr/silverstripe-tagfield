/* global window */
import ReactDOM from 'react-dom';
import TagField from 'components/TagField';

window.jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ss-tag-field').entwine({
    onmatch() {
      const dataSchema = this.data('schema');

      ReactDOM.render(
        <TagField
          {...dataSchema}
        />,
        this[0]
      );
    },

    onunmatch() {
      ReactDOM.unmountComponentAtNode(this[0]);
    }
  });
});
