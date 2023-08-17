import { BaseViewer } from "./BaseViewer"

/**
 * application level viewer
 */
export class FiberViewer extends BaseViewer {

    constructor({ container }) {
        super({ container, assetPath: './asset' })
    }

    startup() {
        super.startup()

        // async setup IBL light 
        this.setupIBL().then(() => {
            this.setup_demo_scene_()
        })
    }

}