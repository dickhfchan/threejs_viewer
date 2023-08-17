import { BaseViewer } from "./BaseViewer"

/**
 * application level viewer
 */
export class FiberViewer extends BaseViewer {

    constructor({ container, assetPath = './asset' }) {
        super({ container, assetPath })
    }

    startup() {
        super.startup()

        // async setup IBL light 
        this.setupIBL().then(() => {
            // this.setup_demo_scene_() // just demo and test!

            this.emit('initLightCompletion')

        })
    }

}
