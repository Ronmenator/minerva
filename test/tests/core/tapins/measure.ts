module minerva.core.measure.tapins.tests {
    QUnit.module("core.tapins.measure");

    import Rect = minerva.Rect;
    import Size = minerva.Size;
    import DirtyFlags = minerva.DirtyFlags;
    import UIFlags = minerva.UIFlags;

    var mock = {
        input: function (): measure.IInput {
            return {
                width: NaN,
                height: NaN,
                minWidth: 0,
                minHeight: 0,
                maxWidth: Number.POSITIVE_INFINITY,
                maxHeight: Number.POSITIVE_INFINITY,
                useLayoutRounding: true,
                margin: new minerva.Thickness(),
                previousConstraint: new Size(),
                visibility: minerva.Visibility.Visible,
                desiredSize: new Size(),
                hiddenDesire: new Size(),
                dirtyFlags: 0,
                uiFlags: 0
            };
        },
        state: function (): measure.IState {
            return {
                availableSize: new Size()
            };
        },
        output: function (): measure.IOutput {
            return <measure.IOutput>{
                error: null,
                previousConstraint: new Size(),
                desiredSize: new Size(),
                hiddenDesire: new Size(),
                dirtyFlags: 0,
                uiFlags: 0,
                origDirtyFlags: 0,
                origUiFlags: 0,
                newUpDirty: 0,
                newDownDirty: 0,
                newUiFlags: 0
            }
        },
        tree: function (): core.IUpdaterTree {
            return new core.UpdaterTree();
        }
    };

    QUnit.test("validate", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        assert.ok(tapins.validate(input, state, output, tree, new Size()));
        assert.strictEqual(minerva.errors.length, 0);

        assert.ok(!tapins.validate(input, state, output, tree, new Size(NaN, NaN)));
        assert.equal(minerva.errors.length, 1);
        minerva.clearErrors();
    });

    QUnit.test("validateVisibility", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        output.previousConstraint = new Size(100, 100);
        output.desiredSize = new Size(50, 50);
        assert.ok(tapins.validateVisibility(input, state, output, tree, new Size()));
        assert.deepEqual(output.previousConstraint, new Size(100, 100));
        assert.deepEqual(output.desiredSize, new Size(50, 50));

        input.visibility = minerva.Visibility.Collapsed;
        output.previousConstraint = new Size();
        var as = new Size(1, 2);
        assert.ok(!tapins.validateVisibility(input, state, output, tree, as));
        assert.notStrictEqual(output.previousConstraint, as);
        assert.deepEqual(output.previousConstraint, new Size(1, 2));
        assert.deepEqual(output.desiredSize, new Size());
    });

    QUnit.test("applyTemplate", (assert) => {
        var tree = mock.tree();

        assert.ok(true);
    });

    QUnit.test("checkNeedMeasure", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        assert.ok(!tapins.checkNeedMeasure(input, state, output, tree, new Size(0, 0)));

        assert.ok(tapins.checkNeedMeasure(input, state, output, tree, new Size(100, 100)));

        input.dirtyFlags |= DirtyFlags.Measure;
        assert.ok(tapins.checkNeedMeasure(input, state, output, tree, new Size(0, 0)));
    });

    QUnit.test("invalidateFuture", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        assert.ok(tapins.invalidateFuture(input, state, output, tree, new Size()));
        assert.strictEqual(output.dirtyFlags, DirtyFlags.Arrange | DirtyFlags.Bounds);
        assert.strictEqual(output.uiFlags, UIFlags.ArrangeHint);
    });

    QUnit.test("prepareOverride", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        //basic
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(50, 100));

        //margin
        input.margin.left = 5;
        input.margin.top = 10;
        input.margin.right = 15;
        input.margin.bottom = 20;
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(30, 70));

        //margin+min/max coerced
        input.minWidth = 35;
        input.maxHeight = 65;
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(35, 65));

        //margin+size+uselayoutrounding
        input.minWidth = 0;
        input.maxHeight = Number.POSITIVE_INFINITY;
        input.width = 29.75;
        input.height = 50.25;
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(30, 50));

        //size+uselayoutrounding+min/max coerced
        input.margin.left = input.margin.top = input.margin.right = input.margin.bottom = 0;
        input.minWidth = 35;
        input.maxHeight = 45;
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(35, 45));
    });

    QUnit.test("doOverride", (assert) => {
        var tree = mock.tree();

        assert.ok(true);
    });

    QUnit.test("completeOverride", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        input.dirtyFlags |= DirtyFlags.Measure;
        output.desiredSize.width = 35;
        output.desiredSize.height = 35;
        assert.ok(tapins.completeOverride(input, state, output, tree, new Size(50, 50)));
        assert.equal(output.dirtyFlags, 0);
        assert.notStrictEqual(output.desiredSize, output.hiddenDesire);
        assert.deepEqual(output.hiddenDesire, new Size(35, 35));
    });

    QUnit.test("finishDesired", (assert) => {
        var input = mock.input();
        var state = mock.state();
        var output = mock.output();
        var tree = mock.tree();

        output.desiredSize.width = 50;
        output.desiredSize.height = 50;
        assert.ok(tapins.finishDesired(input, state, output, tree, new Size(25.2, 24.8)));
        assert.deepEqual(output.desiredSize, new Size(25, 25));

        //margin
        output.desiredSize.width = 50;
        output.desiredSize.height = 50;
        input.margin.left = 5;
        input.margin.top = 10;
        input.margin.right = 15;
        input.margin.bottom = 20;
        assert.ok(tapins.finishDesired(input, state, output, tree, new Size(100, 75)));
        assert.deepEqual(output.desiredSize, new Size(70, 75));

        //margin+min/max coerced
        input.margin.left = input.margin.top = input.margin.right = input.margin.bottom = 0;
        output.desiredSize.width = 50;
        output.desiredSize.height = 50;
        input.minWidth = 72.25;
        input.maxHeight = 65;
        assert.ok(tapins.prepareOverride(input, state, output, tree, new Size(50, 100)));
        assert.deepEqual(state.availableSize, new Size(72, 65));
    });
}