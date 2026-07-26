export declare class K8sTestService {
    private get baseUrl();
    private get authHeaders();
    runSuite(suite: string, diff: string, ns: string): Promise<string>;
    getStatus(runId: string): Promise<string>;
}
//# sourceMappingURL=k8s-test.service.d.ts.map