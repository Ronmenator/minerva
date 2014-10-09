module minerva.core.processup.tapins {
    export var calcPaintBounds: IProcessUpTapin = function (input: IInput, state: IState, output: IOutput, vo: IProcessVisualOwner, tree: core.IUpdaterTree): boolean {
        if ((input.dirtyFlags & DirtyFlags.Bounds) === 0)
            return true;

        helpers.copyGrowTransform4(output.globalBoundsWithChildren, output.extentsWithChildren, input.effectPadding, input.localProjection);
        helpers.copyGrowTransform4(output.surfaceBoundsWithChildren, output.extentsWithChildren, input.effectPadding, input.absoluteProjection);

        return true;
    };
}