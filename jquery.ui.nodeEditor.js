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

        this._setupEvents();
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
                    if ($(ui.helper).closest('.ui-nodeEditor-Menu').length) {
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
    },

    _setupEvents: function() {
        this._setupConnectorEvents();
    },

    _setupConnectorEvents: function() {
        var that = this;
   
        this.nodeField.on('mousedown', '.ui-nodeEditor-nodeConnector', function(ev) {
            console.log('clicked IO');

            var editorPosition = $(that.element).offset();
            var pos = {
                'top': ev.pageY - editorPosition.top,
                'left': ev.pageX - editorPosition.left
            }

            var connectorBox = $('<div></div>')
                .attr('id', 'ui-nodeEditor-activeConnector')
                .data({
                    'clickStartPosition': pos,
                    'clickStartConnector': $(this)
                })
                .css({
                    'top': pos.top,
                    'left': pos.left,
                    'background-color': '#fcc',
                    'position': 'absolute',
                    'z-index': 100,
                    'pointer-events': 'none'

                })
                .appendTo(that.nodeField);

            

        });

        this.nodeField.on('mousemove', function(ev) {
            if ($('#ui-nodeEditor-activeConnector').length) {
                var connector = $('#ui-nodeEditor-activeConnector');
                var connectorPosition = connector.data('clickStartPosition');

                var position = connector.position();
                var editorPosition = $(that.element).offset();

                var connectorPageX = connectorPosition.left + editorPosition.left;
                var connectorPageY = connectorPosition.top + editorPosition.top;

                connector.css({
                    'width': ev.pageX - editorPosition.left - position.left,
                    'top': connectorPosition.top,
                    'left': connectorPosition.left,
                    'height': ev.pageY - editorPosition.top - position.top,
                    'background-color': '#fcc'
                });

                if (ev.pageX < connectorPageX) {
                    //console.log('left of start');
                    connector.css({
                        'left': ev.pageX - editorPosition.left,
                        'width': connectorPageX - ev.pageX,
                        'background-color': '#cfc'
                    });
                }

                if (ev.pageY < connectorPageY) {
                    //console.log('above start');
                    connector.css({
                        'top': ev.pageY - editorPosition.top,
                        'height': connectorPageY - ev.pageY,
                        'background-color': '#ccf'
                    });
                }

            }
        });

        this.nodeField.on('mouseup', '.ui-nodeEditor-nodeConnector', function(ev) {

            if ($('#ui-nodeEditor-activeConnector').length) {
                ev.stopPropagation();
                console.log('making connection!');

                $('#ui-nodeEditor-activeConnector').attr('id', '');
            }
        });

        this.nodeField.on('mouseup', function() {
            if ($('#ui-nodeEditor-activeConnector').length) {
                console.log('releasing connector');

                $('#ui-nodeEditor-activeConnector').empty().remove();
            }
        });

    }

});

})( jQuery );
