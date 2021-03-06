define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/sniff',
    'dojo/dom-style'
], function (
    declare,
    lang,
    topic,
    has,
    domStyle
) {

    return declare(null, {

        exportWidgetID: 'exportWidget',

        toolbarOptions: {},

        defaultToolbarOptions: {
            show: true,

            zoom: {
                show: true,
                features: true,
                selected: true,
                source: true,
                buffer: true

            },

            clear: {
                show: true,
                grid: true,
                features: true,
                selected: true,
                source: true,
                buffer: true
            },

            'export': {
                show: !has('ie') || has('ie') > 9,
                options: {}
            }
        },

        getToolbarConfiguration: function (options) {
            this.toolbarOptions = this.mixinDeep(lang.clone(this.defaultToolbarOptions), options);
        },

        setToolbarButtons: function () {
            this.showMainMenuItems();
            this.enableMenuItems();
        },

        // show/hide items on the main menu
        showMainMenuItems: function () {
            var featOptions = this.featureOptions || {};

            var options = this.toolbarOptions.zoom || {};
            if (!featOptions.features && !featOptions.buffer) {
                options.show = false;
            }

            var display = (options.show) ? 'inline-block' : 'none';
            domStyle.set(this.attributesTableZoomDropDownButton.domNode, 'display', display);
            if (options.show !== false) {
                this.showZoomMenuItems();
            }

            options = this.toolbarOptions.clear || {};
            display = (options.show) ? 'inline-block' : 'none';
            domStyle.set(this.attributesTableClearDropDownButton.domNode, 'display', display);
            if (options.show !== false) {
                this.showClearMenuItems();
            }

            /*eslint dot-notation: 0 */
            options = this.toolbarOptions['export'] || {};
            display = (options.show) ? 'inline-block' : 'none';
            domStyle.set(this.attributesTableExportButton.domNode, 'display', display);

        },

        // show/hide items on 'Zoom' drop-down menu
        showZoomMenuItems: function () {
            var options = this.toolbarOptions.zoom || {};
            var featOptions = this.featureOptions || {};
            var display = (options.features && featOptions.features) ? 'block' : 'none';
            domStyle.set(this.attributesTableZoomToFeatures.domNode, 'display', display);

            display = (options.selected && featOptions.selected) ? 'block' : 'none';
            domStyle.set(this.attributesTableZoomToSelected.domNode, 'display', display);

            display = (options.source && featOptions.source) ? 'block' : 'none';
            domStyle.set(this.attributesTableZoomToSource.domNode, 'display', display);

            display = (options.buffer) ? 'block' : 'none';
            domStyle.set(this.attributesTableZoomToBuffer.domNode, 'display', display);
        },

        // show/hide items on 'Clear' drop-down menu
        showClearMenuItems: function () {
            var options = this.toolbarOptions.clear || {};
            var featOptions = this.featureOptions || {};
            var itemCount = 0;

            var display = (options.grid) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearGrid.domNode, 'display', display);

            display = (options.features && featOptions.features) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearFeatures.domNode, 'display', display);

            display = (options.selected && featOptions.selected) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearSelected.domNode, 'display', display);

            display = (options.source && featOptions.source) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearSource.domNode, 'display', display);

            display = (options.buffer) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearBuffer.domNode, 'display', display);

            display = (options.selected && featOptions.selected) ? 'block' : 'none';
            itemCount += (display === 'none') ? 0 : 1;
            domStyle.set(this.attributesTableClearSelectedRecords.domNode, 'display', display);

            //display = (options.show) ? 'block' : 'none';
            display = (itemCount > 1) ? 'block' : 'none';
            domStyle.set(this.attributesTableClearAll.domNode, 'display', display);
        },

        // enable/disable menu options based on the current result features available
        enableMenuItems: function () {
            var feat = this.features;
            var coll = this.grid.get('collection');

            var disabled = ((feat && feat.length > 0) || (coll.data && coll.data.length > 0)) ? false : true;
            this.attributesTableExportButton.set('disabled', disabled);
            this.attributesTableZoomDropDownButton.set('disabled', disabled);
            this.attributesTableClearDropDownButton.set('disabled', disabled);

            disabled = (feat && feat.length > 0) ? false : true;
            this.attributesTableClearFeatures.set('disabled', disabled);
            this.attributesTableZoomToFeatures.set('disabled', disabled);

            disabled = (this.selectedGraphics && this.selectedGraphics.graphics && this.selectedGraphics.graphics.length > 0) ? false : true;
            this.attributesTableClearSelected.set('disabled', disabled);
            this.attributesTableZoomToSelected.set('disabled', disabled);
            this.attributesTableClearSelectedRecords.set('disabled', disabled);

            disabled = (this.sourceGraphics && this.sourceGraphics.graphics && this.sourceGraphics.graphics.length > 0) ? false : true;
            this.attributesTableClearSource.set('disabled', disabled);
            this.attributesTableZoomToSource.set('disabled', disabled);

            disabled = (this.bufferGraphics && this.bufferGraphics.graphics.length > 0) ? false : true;
            this.attributesTableClearBuffer.set('disabled', disabled);
            this.attributesTableZoomToBuffer.set('disabled', disabled);
        },

        openExport: function () {
            topic.publish(this.exportWidgetID + '/openDialog', lang.mixin({
                results: this.results,
                featureSet: this.featureSet || this.results,
                grid: this.grid,
                show: true
            }, this.toolbarOptions.export.options));
        }
    });
});
