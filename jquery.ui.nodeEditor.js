// Copyright 2012 - Malcolm Dwyer
// Distributed under MIT license
// http://opensource.org/licenses/mit-license.php/


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

        this._buildNodeMenu();
        this._buildNodeField();

        this._populateNodeMenu();
    },

    _buildNodeMenu: function() {
        console.group('buildNodeMenu');

        this.nodeMenu = $('<div></div>')
            .addClass('ui-nodeEditor-Menu')
            .appendTo(this.element);

        console.groupEnd();
    },

    _populateNodeMenu: function() {
        var that = this;

        console.group('populateNodeMenu');
        $.each(this.options.nodes, function(index, node) {
            console.log('New Node: ' + node.label);

            that._buildNode(node);   
        });
        console.groupEnd();
    },

    _buildNodeField: function() {
        console.group('buildNodeMenu');

        this.nodeField = $('<div></div>')
            .addClass('ui-nodeEditor-Field')
            .appendTo(this.element)
            .droppable({
                accept: '.ui-nodeEditor-Node',
                drop: function(ev,ui) {
                    if ($(ui.helper).parents('.ui-nodeEditor-Menu').length) {
                        var element = $(ui.draggable).clone();
                        $(this).append(element);
                        element.attr('id', 'clone');
                    }
                }
            });
        console.groupEnd();
    },

    _buildNode: function(node) {
        var that = this;
        var nodeElement = $('<div></div>')
            .addClass('ui-nodeEditor-Node')
            .appendTo(this.nodeMenu)
            .draggable({
                revert: 'invalid',
                containment: '.ui-nodeEditor',
                helper: 'clone',
                stop: function (ev, ui) {
                    var pos = $(ui.helper).position();
                    var obj = $('#clone');
                    obj.css({
                        'left': pos.left,
                        'top':  pos.top
                    });

                    obj.draggable({
                        containment: 'parent',
                        stack: '.ui-nodeEditor-Node',
                        cancel: '.ui-nodeEditor-nodeConnector'
                    });

                    obj.attr('id', '');
                }
            });

        var label = $('<div class="ui-NodeEditor-nodeLabel">' +
                          node.label +
                      '</div>')
            .appendTo(nodeElement);

        node.inputs = node.inputs || [];
        $.each(node.inputs, function(idx, input) {
            $('<div class="ui-nodeEditor-nodeIO ui-nodeEditor-nodeInput">' +
                  '<div class="ui-nodeEditor-nodeConnector ui-nodeEditor-nodeInputConnector"></div>' +
                  '<div class="ui-nodeEditor-nodeInputLabel">' +
                      input.label + '</div>' +
              '</div>')
              .appendTo(nodeElement);
        });

        node.outputs = node.outputs || [];
        $.each(node.outputs, function(idx, output) {
            $('<div class="ui-nodeEditor-nodeIO ui-nodeEditor-nodeOutput">' +
                  '<div class="ui-nodeEditor-nodeOutputLabel">' +
                      output.label + '</div>' +
                  '<div class="ui-nodeEditor-nodeConnector ui-nodeEditor-nodeOutputConnector"></div>' +
              '</div>')
              .appendTo(nodeElement);
        });

        return nodeElement;
    }

});

})( jQuery );
