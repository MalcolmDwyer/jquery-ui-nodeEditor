

$(document).ready(function() {
    console.log("Starting basic example for jquery.ui.nodeEditor.js");

    $('<div></div>')
        .addClass('nodeEditor')
        .appendTo('body')
        .nodeEditor({
            nodes: [
                {
                    label: '5',
                    inputs: [],
                    outputs: [
                        {
                            label: 'Output',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.resolve(5);
                                return d.promise;
                            }
                        }
                    ],
                    properties: []
                },
                {
                    label: '+',
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
                            label: 'Output',
                            fn: function(inputs, properties) {
                                var d = $.Deferred();
                                d.resolve(parseInt(inputs.A + inputs.B));
                                return d.promise;
                            }
                        }
                    ]
                }
            ]
        });
});
