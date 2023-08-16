import { BaseViewer } from "./BaseViewer"

/**
 * application level viewer
 */
export class FiberViewer extends BaseViewer {

    constructor({ container }) {
        super({ container })
    }

    startup() {
        super.startup()
        this.setupIBL()
        this.setup_demo_scene_()
    }

}