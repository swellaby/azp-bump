declare module VstsBump {
    export type BumpType = 'major' | 'minor' | 'patch';

    /**
     * The options to use for bumping Tasks.
     *
     * @export
     * @interface Opts
     */
    export interface Opts {
        /**
         * Specifies the type of spacing indent to use when updating the task manifest files.
         * Numbers between 1 and 10 can be specified to apply that amount of space characters, or
         * alternatively a tab can be specified via a 't', 'tab', or '\t' character.
         *
         * @type {(number|string)}
         * @memberof Opts
         */
        indent?: number|string,
        /**
         * Specifies whether or not the bump process should be quiet. If true, log output will
         * be suppressed.
         *
         * @type {boolean}
         * @memberof Opts
         */
        quiet?: boolean,
        /**
         * Specifies what type to use for the version properties (Major, Minor, Patch) in the
         * updated task manifest files, as VSTS will accept versions as either strings or numbers.
         * Allowed options are: 'number' or 'string'.
         *
         * @type {string)}
         * @memberof Opts
         */
        versionPropertyType?: string,
        /**
         * Specifies the type of bump to perform. Valid options are: 'major', 'minor', or 'patch'.
         *
         * @type {BumpType}
         * @memberof Opts
         */
        type?: BumpType
    }

    /**
     * Represents the result of a bumped task manifest file.
     *
     * @export
     * @interface BumpedFileResult
     */
    export interface BumpedFileResult {
        /**
         * The path to the task manifest file that was bumped.
         *
         * @type {string}
         * @memberof BumpedFileResult
         */
        filePath: string,
        /**
         * The original version the task manifest file contained before the bump was executed.
         *
         * @type {string}
         * @memberof BumpedFileResult
         */
        initialVersion: string,
        /**
         * The new/updated version in the task manifest file after the bump executed successfully.
         *
         * @type {string}
         * @memberof BumpedFileResult
         */
        bumpedVersion: string
    }

    /**
     * Represents the result of the requested bump operation.
     *
     * @export
     * @interface BumpResult
     */
    export interface BumpResult {
        /**
         * The type of bump (major, minor, or patch) that was performed.
         *
         * @type {string}
         * @memberof BumpResult
         */
        bumpType: string,
        /**
         * The collection of results for each individual task manifest file that was bumped.
         *
         * @type {BumpedFileResult[]}
         * @memberof BumpResult
         */
        bumpedFiles: BumpedFileResult[]
    }

    /**
     * Represents a VSTS Task Manifest
     *
     * @export
     * @interface VstsTask
     */
    export interface VstsTask {
        version: {
            Major: number|string,
            Minor: number|string,
            Patch: number|string
        }
    }

    /**
     * Bumps the provided task object with the specified bump type.
     *
     * @export
     * @param {VstsTask} task - The VSTS Task to bump.
     * @param {BumpType} [bumpType] - The type of bump to perform.
     */
    export function bumpTask(task: VstsTask, bumpType?: BumpType): void;

    /**
     * Bumps the provided task objects with the specified bump type.
     *
     * @export
     * @param {VstsTask[]} tasks - The VSTS Tasks to bump.
     * @param {BumpType} [bumpType] - The type of bump to perform.
     */
    export function bumpTasks(tasks: VstsTask[], bumpType?: BumpType): void;

    /**
     * Bumps all of the task manifest files in the specified globs using the provided bump options.
     *
     * @export
     * @param {string[]} fileGlobs - The globs containing the task manifest files to be bumped.
     * @param {Opts} [opts] - The bump options to use.
     *
     * @returns {Promise<BumpResult>}
     */
    export function bumpTaskManifestFiles(fileGlobs: string[], opts?: Opts): Promise<BumpResult>;
}

export = VstsBump
