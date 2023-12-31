import {
    ACESFilmicToneMapping, BoxGeometry, Clock, Color, DefaultLoadingManager, EquirectangularReflectionMapping,
    Mesh, MeshStandardMaterial, PMREMGenerator, PerspectiveCamera, Scene, SphereGeometry, TorusKnotGeometry, WebGLRenderer
} from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import EventEmitter from "events"

/**
 * base level viewer
 */
export class BaseViewer extends EventEmitter {

    constructor({ container, assetPath }) {

        super()

        this.container_ = container
        this.assetPath_ = assetPath

        this.pixelRatio_ = window.devicePixelRatio

        this.disposed_ = false

        this.size_ = {
            w: 0,
            h: 0,
            pw: 0,
            ph: 0,
        }

        this.clock_ = new Clock()

    }


    startup() {

        this.calc_size__()

        this.renderer_ = new WebGLRenderer({
            antialias: true,
        })
        this.renderer_.setPixelRatio(this.pixelRatio_)
        this.renderer_.setSize(this.size_.w, this.size_.h)

        // hdr

        this.container_.appendChild(this.renderer_.domElement)

        this.camera_ = new PerspectiveCamera(45, this.size_.w / this.size_.h, .1, 1000)
        this.camera_.position.set(0, 0, 20)

        this.scene_ = new Scene()
        this.scene_.background = new Color(0xe4eff0)

        this.env_ref_ = {
            envMap: null
        }

        this.on_resize__ = () => {
            this.resize_()
        }
        window.addEventListener('resize', this.on_resize__)
        this.resize_()

        this.controls_ = new OrbitControls(this.camera_, this.renderer_.domElement)
        this.controls_.enableDamping = true

        this.animate_()

    }

    dispose() {

        this.disposed_ = true
        // this.controls_.dispose()
        window.removeEventListener('resize', this.on_resize___)
        this.renderer_.dispose()
    }

    // -------------------------------------------------------------------------

    calc_size__() {
        let w = this.container_.clientWidth
        let h = this.container_.clientHeight

        this.size_.w = w
        this.size_.h = h
        this.size_.pw = w * this.pixelRatio_
        this.size_.ph = h * this.pixelRatio_

        // console.log('calc_size__', this.opts_.instanceName, this.size_, this.container_)
    }

    resize_() {

        this.calc_size__()

        let aspect = this.size_.w / this.size_.h
        let cam = this.camera_
        cam.aspect = aspect
        cam.updateProjectionMatrix()

        this.renderer_.setSize(this.size_.w, this.size_.h)

    }

    animate_() {
        if (!this.disposed_) {
            requestAnimationFrame(() => { this.animate_() })

            const delta = this.clock_.getDelta()

            if (this.controls_.enabled) {
                this.controls_.update(delta)
            }

            this.renderer_.render(this.scene_, this.camera_)
        }
    }


    // -------------------------------------------------------------------------


    setup_demo_scene_() {

        let m = new Mesh(
            // new SphereGeometry(),
            // new BoxGeometry(),
            new TorusKnotGeometry(18 / 7, 8 / 7, 150, 20),
            new MeshStandardMaterial({
                color: 0x78cce2,
                envMap: this.env_ref_.envMap,
                metalness: 1,
                roughness: 0.3,
            }))
        this.scene_.add(m)

    }

    // Please use IBL ligthing the scene, prevent old lighting mode (ex. point, diretional light in scene)
    // https://en.wikipedia.org/wiki/Image-based_lighting
    setupIBL() {
        return new Promise(resolve => {

            this.renderer_.toneMapping = ACESFilmicToneMapping

            const pmremGenerator = new PMREMGenerator(this.renderer_)
            pmremGenerator.compileEquirectangularShader()

            new EXRLoader().load(`${this.assetPath_}/env/ninomaru_teien_1k.exr`, texture => {
                texture.mapping = EquirectangularReflectionMapping

                // exrCubeRenderTarget = 
                pmremGenerator.fromEquirectangular(texture)
                this.env_ref_.envMap = texture
                // this.scene_.background = texture

                pmremGenerator.dispose()
                resolve()
            })

            // DefaultLoadingManager.onLoad = () => {
            //     pmremGenerator.dispose()
            //     resolve()
            // }

        })
    }

    loadModel({path, name}) {

        const loader = new GLTFLoader().setPath(path)
        loader.load(name, gltf => {
            this.scene_.add(gltf.scene)
        })

    }

}