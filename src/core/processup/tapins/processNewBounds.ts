module minerva.core.processup.tapins {
    export var processNewBounds: IProcessUpTapin = function (input: IInput, state: IState, output: IOutput, vo: IProcessVisualOwner, tree: core.IUpdaterTree): boolean {
        if ((input.dirtyFlags & DirtyFlags.NewBounds) === 0 && !state.hasNewBounds)
            return true;
        output.dirtyFlags |= DirtyFlags.Invalidate;
        state.hasInvalidate = true;
        Rect.union(output.dirtyRegion, output.surfaceBoundsWithChildren);
        return true;
    };
}