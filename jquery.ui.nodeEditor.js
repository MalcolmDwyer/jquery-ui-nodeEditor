

(function( $, undefined ) {

$.widget("ui.nodeEditor", {

    options: {
        nodes: []
    },

    _create: function() {
        console.log("nodeEditor.create()");

        $(this.element).addClass('ui-nodeEditor');
    },

    _init: function() {
        $(this.element).empty();

        $('<div></div>')
            .attr('id', 'ui-nodeEditor-Menu')
            .appendTo(this.element);

        $('<div></div>')
            .attr('id', 'ui-nodeEditor-Field')
            .appendTo(this.element);

        this._buildNodeMenu();
    },

    _buildNodeMenu: function() {
        console.group('buildNodeMenu');
        $.each(this.options.nodes, function(index, node) {
            console.log('New Node: ' + node.label);

            $('<div>' + node.label + '</div>')
                .addClass('ui-nodeEditor-Node')
                .appendTo('#ui-nodeEditor-Menu');
        });
    }

});

})( jQuery );
