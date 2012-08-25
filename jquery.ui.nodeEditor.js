// Copyright 2012 - Malcolm Dwyer
// Distributed under MIT license
// http://opensource.org/licenses/mit-license.php/


(function( $, undefined ) {

$.widget("ui.nodeEditor", {

    options: {
        nodes: []
    },

    _create: function() {
        //console.log("nodeEditor.create()");

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
        //console.group('buildNodeMenu');

        this.nodeMenu = $('<div></div>')
            .addClass('ui-nodeEditor-Menu')
            .appendTo(this.element);

        //console.groupEnd();
    },

    _populateNodeMenu: function() {
        var that = this;

        //console.group('populateNodeMenu');
        $.each(this.options.nodes, function(index, node) {
            //console.log('New Node: ' + node.label);

            that._buildNode(node);   
        });
        //console.groupEnd();
    },

    _buildNodeField: function() {
        //console.group('buildNodeMenu');

        var that = this;
        this.nodeField = $('<div></div>')
            .addClass('ui-nodeEditor-Field')
            .appendTo(this.element)
            .droppable({
                accept: '.ui-nodeEditor-Node',
                drop: function(ev,ui) {
                    if ($(ui.helper).closest('.ui-nodeEditor-Menu').length) {
                        //console.log('Field drop');
                        var element = $(ui.draggable).clone(false);
                        var nodeCopy = $.extend(true, {}, $(ui.draggable).data('node'));
                        $(this).append(element);
                        element.attr('id', 'clone');
                        that._setupNodeInField(element, nodeCopy);
                    }
                }
            });
        //console.groupEnd();
    },

    _buildNode: function(node) {
        var that = this;
        var nodeElement = $('<div></div>')
            .addClass('ui-nodeEditor-Node')
            .appendTo(this.nodeMenu)
            .data('node', node)
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

        this._buildNodeIO(nodeElement, node);

        return nodeElement;
    },

    _buildNodeIO: function(nodeElement, node) {
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
            var outputDiv = $('<div class="ui-nodeEditor-nodeIO ui-nodeEditor-nodeOutput">' +
                  '<div class="ui-nodeEditor-nodeOutputLabel">' +
                      output.label + '</div>' +
              '</div>')
              .appendTo(nodeElement);

            var connector = $('<div></div>')
                .addClass('ui-nodeEditor-nodeConnector')
                .addClass('ui-nodeEditor-nodeOutputConnector')
                .appendTo(outputDiv);

            //console.log('built output connector');
            //console.log(output);
        });
    },

    _setupNodeInField: function(element, node) {
        var that = this;
        //console.group('_setupNodeInField ' + node.label);
        //element.data('node', node);

        element.empty();
        this._buildNodeIO(element, node);

        node.state = {
            inputs: {},
            properties: {}
        };
        that._updateAlt(element, node);

        node.update = function(updateMap) {

            //console.group('node.update() ' + node.label);
            //console.log(updateMap);

            if (updateMap && updateMap.inputs) {
                for (input in updateMap.inputs) {
                    node.state.inputs[input] = updateMap.inputs[input];
                }
            }
            if (updateMap && updateMap.properties) {
                for (prop in updateMap.properties) {
                    node.state.properties[prop] = updateMap.properties[prop];
                }
            }

            //console.log('new state:');
            //console.log(node.state);
            console.groupEnd();

            element.find('.ui-nodeEditor-nodeOutputConnector').each(function (idx, output) {
                $(output).data('update')();
            });

            // call output.update for each output 
        };

        element.find('.ui-nodeEditor-nodeInputConnector').each(function (idx, input) {
            console.log('input[' + idx + '] ' + node.inputs[idx].label);

            $(this).data('update', function(value) {
                console.log('Input ' + node.inputs[idx].label + ' received value: ' + value);
                var updateMap = {inputs:{}};
                updateMap.inputs[node.inputs[idx].label] = value;

                node.update(updateMap);
            });

        });

        element.find('.ui-nodeEditor-nodeOutputConnector').each(function (idx, output) {
            //console.log('Found output: ' + idx);
            if (node.outputs[idx] && node.outputs[idx].fn) {

                var outD = $.Deferred();
                $(output).data('deferred', outD.promise());

                $(output).data('update', function() {
                    //console.log('in output.update()... calling fn()');
                    //console.log(node.state);
                    var resultDeferred = node.outputs[idx].fn(node.state);

                    resultDeferred.done(function(result) {
                        console.log('Computed result for output, notifying: ' + result);
                        outD.notify(result);
                    });
                });

                $(output).data('update')();
            }
            else {
                console.log('something is wrong setting output function ' + node.label);
            }
        });

        //console.groupEnd();
    },

    _updateAlt: function(element, node) {
        var altString = '[' + node.label + ']';
        for (input in node.state.inputs) {
            altString += '    ' + input + ':  ' + node.state.inputs[input];
        };
        $(element).attr('alt', altString);
    },

    _setupEvents: function() {
        this._setupConnectorEvents();
    },

    _setupConnectorEvents: function() {
        var that = this;
   
        this.nodeField.on('mousedown', '.ui-nodeEditor-nodeConnector', function(ev) {

            var editorPosition = $(that.element).offset();
            var pos = {
                'top': ev.pageY - editorPosition.top,
                'left': ev.pageX - editorPosition.left
            }

            var connectorBox = $('<div class="ui-nodeEditor-wire"></div>')
                .attr('id', 'ui-nodeEditor-activeConnector')
                .data({
                    'clickStartPosition': pos,
                    'clickStartConnector': $(this)
                })
                .css({
                    'top': pos.top,
                    'left': pos.left,
                    'background-color': '#fcc',

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

                var wire = $('#ui-nodeEditor-activeConnector');
                var wireOrigin = wire.data('clickStartConnector');

                wire.attr('id', '');

                wire.data('clickEndConnector', $(this));

                var from, to;

                if (  $(this).hasClass('ui-nodeEditor-nodeOuptputConnector') &&
                      wireOrigin.hasClass('ui-nodeEditor-nodeInputConnector')) {

                      from = $(this);
                      to   = wireOrigin;

                }
                else if (  $(this).hasClass('ui-nodeEditor-nodeInputConnector') &&
                      wireOrigin.hasClass('ui-nodeEditor-nodeOutputConnector')) {

                      from = wireOrigin;
                      to   = $(this);
                }
                else {
                    console.error('Tried to connect input to input or output to output');
                    wire.empty().remove();
                    return;
                }


                console.log('Connection from %s to %s', from.parent().text(), to.parent().text());
                var getPromise = from.data('deferred');

                getPromise.progress(function(data) {
                    console.log('Wire transferring value: ' + data);
                    to.data('update')(data);
                });
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
