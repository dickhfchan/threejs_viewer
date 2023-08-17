import { FiberViewer } from '../fiber-comp/comp/FiberViewer'

const assetPath = './asset'

const fiberViewer = new FiberViewer({
    // layout the container (HTML element) first
    container: document.getElementById('fiber-comp-c1-'),
    assetPath,
})

fiberViewer.on('initLightCompletion', e => {
    // fiberViewer.setup_demo_scene_()

    fiberViewer.loadModel({
        path: `${assetPath}/model/`,
        name: 'BAll2.glb',
    })
})

fiberViewer.startup()

