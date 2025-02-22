import template from './sw-card.html.twig';
import './sw-card.scss';

const { Component, Feature } = Shopware;

/**
 * @public
 * @description A card is a flexible and extensible content container.
 * @status ready
 * @example-type dynamic
 * @component-example
 * <sw-card title="Test title" subtitle="Test subtitle">
 *     Your content
 * </sw-card>
 */
Component.register('sw-card', {
    template,

    props: {
        positionIdentifier: {
            type: String,
            // eslint-disable-next-line no-unneeded-ternary
            required: Feature.isActive('FEATURE_NEXT_18129') ? true : false,
            default: null,
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        subtitle: {
            type: String,
            required: false,
            default: '',
        },
        hero: {
            type: Boolean,
            required: false,
            default: false,
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        large: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    methods: {
        cardClasses() {
            const classes = {
                'sw-card--tabs': !!this.$slots.tabs || !!this.$scopedSlots.tabs,
                'sw-card--grid': !!this.$slots.grid || !!this.$scopedSlots.grid,
                'sw-card--hero': !!this.hero,
                'sw-card--large': this.large,
                'has--header': !!this.$slots.toolbar || !!this.$scopedSlots.toolbar,
            };

            if (!this.$refs.swIgnoreClass) {
                this.$nextTick(() => {
                    this.$forceUpdate();
                });

                return classes;
            }

            const staticClasses = (this.$refs.swIgnoreClass?.$el?._prevClass ?? '').split(' ');

            // add attrs classes to main card
            staticClasses.forEach((className) => {
                this.$set(classes, className, true);
            });

            // remove classes from ignore class
            this.$nextTick(() => {
                if (this.$refs.swIgnoreClass?.$el?.className) {
                    this.$refs.swIgnoreClass.$el.className = '';
                }
            });

            return classes;
        },
    },
});
