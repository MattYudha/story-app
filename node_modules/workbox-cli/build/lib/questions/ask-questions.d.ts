interface ConfigWithConfigLocation {
    config: {
        [key: string]: any;
    };
    configLocation: string;
}
export declare function askQuestions(options?: {}): Promise<ConfigWithConfigLocation>;
export {};
