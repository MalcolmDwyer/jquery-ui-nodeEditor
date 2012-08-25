// Copyright 2012 - Malcolm Dwyer
// Distributed under MIT license
// http://opensource.org/licenses/mit-license.php/

$(document).ready(function() {
    console.log("Starting basic example for jquery.ui.nodeEditor.js");

    $('<div></div>')
        .addClass('nodeEditor')
        .appendTo('body')
        .nodeEditor({
            nodes: [
                {
                    label: '5',
                    outputs: [
                        {
                            label: 'Value',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.resolve(5);
                                return d.promise();
                            }
                        }
                    ]
                },
                {
                    label: '8',
                    outputs: [
                        {
                            label: 'Value',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.resolve(8);
                                return d.promise();
                            }
                        }
                    ]
                },
                /*{
                    label: 'Display',
                    inputs: [
                        {
                            id: 'A',
                            label: 'A'
                        }
                    ],
                    display: function(inputs, properties) {
                        
                    }
                },*/
                {
                    label: 'Add',
                    inputs: [
                        {
                            id: 'A',
                            label: 'A'
                        },
                        {
                            id: 'B',
                            label: 'B'
                        }
                    ],
                    outputs: [
                        {
                            label: 'Sum',
                            fn: function(nodeState) {
                                console.group('Sum fn()');
                                //console.log(nodeState);
                                var d = $.Deferred();
                                if (typeof nodeState === 'undefined') {
                                    console.error('Node state undefined');
                                    d.reject();
                                    console.groupEnd();
                                    return d.promise();
                                }

                                inputs = nodeState.inputs || {};
                                inputs.A = inputs.A || 0;
                                inputs.B = inputs.B || 0;

                                console.log('Sum fn() A:' + inputs.A + '  B:' + inputs.B);
                                var out = parseInt(inputs.A + inputs.B);
                                console.log('    -->  ' + out);
                                d.resolve(out);
                                console.groupEnd();
                                return d.promise();
                            }
                        }
                    ]
                }
            ]
        });
});
