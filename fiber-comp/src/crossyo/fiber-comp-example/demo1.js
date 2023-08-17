import { FiberViewer } from '../fiber-comp/comp/FiberViewer'

const fiberViewer = new FiberViewer({
    // layout the container (HTML element) first
    container: document.getElementById('fiber-comp-c1-')
})

fiberViewer.startup()

