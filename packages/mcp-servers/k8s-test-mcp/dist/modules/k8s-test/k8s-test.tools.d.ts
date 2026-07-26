export declare class K8sTestTools {
    constructor();
    runEphemeralTestSuite(args: {
        suite_name: string;
        patch_diff: string;
        target_namespace: string;
    }): Promise<string>;
    getTestExecutionStatus(args: {
        run_id: string;
    }): Promise<string>;
}
//# sourceMappingURL=k8s-test.tools.d.ts.map