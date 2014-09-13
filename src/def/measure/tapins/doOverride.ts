module minerva.def.measure.tapins {
    export var doOverride: IMeasureTapin = function (assets: IAssets, state: IState, output: IOutput, availableSize: Size): boolean {
        output.desiredSize.width = 0;
        output.desiredSize.height = 0;
        return true;
    };
}