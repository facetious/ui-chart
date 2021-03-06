import { CandleEntry } from './CandleEntry';
import { ICandleDataSet } from '../interfaces/datasets/ICandleDataSet';
import { LineScatterCandleRadarDataSet } from './LineScatterCandleRadarDataSet';
import { Style } from '@nativescript-community/ui-canvas';
import { ColorTemplate } from '../utils/ColorTemplate';
import { Utils } from '../utils/Utils';

export class CandleDataSet extends LineScatterCandleRadarDataSet<CandleEntry> implements ICandleDataSet {
    /**
     * property to access the "high" value of an entry for this set
     *
     */
    highProperty: string = 'high';
    /**
     * property to access the "low" value of an entry for this set
     *
     */
    lowProperty: string = 'low';
    /**
     * property to access the "close" value of an entry for this set
     *
     */
    closeProperty: string = 'close';

    /**
     * property to access the "open" value of an entry for this set
     *
     */
    openProperty: string = 'open';

    /**
     * the width of the shadow of the candle
     */
    private mShadowWidth = 3;

    /**
     * should the candle bars show?
     * when false, only "ticks" will show
     * <p/>
     * - default: true
     */
    private mShowCandleBar = true;

    /**
     * the space between the candle entries, default 0.1 (10%)
     */
    private mBarSpace = 0.1;

    /**
     * use candle color for the shadow
     */
    private mShadowColorSameAsCandle = false;

    /**
     * palet style when open < close
     * increasing candlesticks are traditionally hollow
     */
    protected mIncreasingPaintStyle = Style.STROKE;

    /**
     * palet style when open > close
     * descreasing candlesticks are traditionally filled
     */
    protected mDecreasingPaintStyle = Style.FILL;

    /**
     * color for open == close
     */
    protected mNeutralColor = ColorTemplate.COLOR_SKIP;

    /**
     * color for open < close
     */
    protected mIncreasingColor = ColorTemplate.COLOR_SKIP;

    /**
     * color for open > close
     */
    protected mDecreasingColor = ColorTemplate.COLOR_SKIP;

    /**
     * shadow line color, set -1 for backward compatibility and uses default
     * color
     */
    protected mShadowColor = ColorTemplate.COLOR_SKIP;

    constructor(yVals, label, xProperty?, yProperty?, highProperty?, lowProperty?, openProperty?, closeProperty?) {
        super(yVals, label, xProperty, yProperty);
        if (highProperty) {
            this.highProperty = highProperty;
        }
        if (lowProperty) {
            this.lowProperty = lowProperty;
        }
        if (openProperty) {
            this.openProperty = openProperty;
        }
        if (closeProperty) {
            this.closeProperty = closeProperty;
        }
        this.init();
    }

    protected calcMinMaxForEntry(e?: CandleEntry, index?: number) {
        if (!e) return;
        const high = e[this.highProperty];
        const low = e[this.lowProperty];

        if (low < this.mYMin) this.mYMin = low;

        if (high > this.mYMax) this.mYMax = high;

        this.calcMinMaxX(e, index);
    }

    protected calcMinMaxY(e: CandleEntry) {
        const high = e[this.highProperty];
        const low = e[this.lowProperty];
        if (high < this.mYMin) this.mYMin = high;

        if (high > this.mYMax) this.mYMax = high;

        if (low < this.mYMin) this.mYMin = low;

        if (low > this.mYMax) this.mYMax = low;
    }

    /**
     * Sets the space that is left out on the left and right side of each
     * candle, default 0.1 (10%), max 0.45f, min 0
     *
     * @param space
     */
    public setBarSpace(space) {
        if (space < 0) space = 0;
        if (space > 0.45) space = 0.45;

        this.mBarSpace = space;
    }

    public getBarSpace() {
        return this.mBarSpace;
    }

    /**
     * Sets the width of the candle-shadow-line in pixels. Default 3f.
     *
     * @param width
     */
    public setShadowWidth(width) {
        this.mShadowWidth = width;
    }

    public getShadowWidth() {
        return this.mShadowWidth;
    }

    /**
     * Sets whether the candle bars should show?
     *
     * @param showCandleBar
     */
    public setShowCandleBar(showCandleBar) {
        this.mShowCandleBar = showCandleBar;
    }

    public getShowCandleBar() {
        return this.mShowCandleBar;
    }

    // TODO
    /**
     * It is necessary to implement ColorsList class that will encapsulate
     * colors list functionality, because It's wrong to copy paste setColor,
     * addColor, ... resetColors for each time when we want to add a coloring
     * options for one of objects
     *
     * @author Mesrop
     */

    /** BELOW THIS COLOR HANDLING */

    /**
     * Sets the one and ONLY color that should be used for this DataSet when
     * open == close.
     *
     * @param color
     */
    public setNeutralColor(color) {
        this.mNeutralColor = color;
    }

    public getNeutralColor() {
        return this.mNeutralColor;
    }

    /**
     * Sets the one and ONLY color that should be used for this DataSet when
     * open <= close.
     *
     * @param color
     */
    public setIncreasingColor(color) {
        this.mIncreasingColor = color;
    }

    public getIncreasingColor() {
        return this.mIncreasingColor;
    }

    /**
     * Sets the one and ONLY color that should be used for this DataSet when
     * open > close.
     *
     * @param color
     */
    public setDecreasingColor(color) {
        this.mDecreasingColor = color;
    }

    public getDecreasingColor() {
        return this.mDecreasingColor;
    }

    public getIncreasingPaintStyle() {
        return this.mIncreasingPaintStyle;
    }

    /**
     * Sets palet style when open < close
     *
     * @param paintStyle
     */
    public setIncreasingPaintStyle(paintStyle) {
        this.mIncreasingPaintStyle = paintStyle;
    }

    public getDecreasingPaintStyle() {
        return this.mDecreasingPaintStyle;
    }

    /**
     * Sets palet style when open > close
     *
     * @param decreasingPaintStyle
     */
    public setDecreasingPaintStyle(decreasingPaintStyle) {
        this.mDecreasingPaintStyle = decreasingPaintStyle;
    }

    public getShadowColor() {
        return this.mShadowColor;
    }

    /**
     * Sets shadow color for all entries
     *
     * @param shadowColor
     */
    public setShadowColor(shadowColor) {
        this.mShadowColor = shadowColor;
    }

    public getShadowColorSameAsCandle() {
        return this.mShadowColorSameAsCandle;
    }

    /**
     * Sets shadow color to be the same color as the candle color
     *
     * @param shadowColorSameAsCandle
     */
    public setShadowColorSameAsCandle(shadowColorSameAsCandle) {
        this.mShadowColorSameAsCandle = shadowColorSameAsCandle;
    }
}
