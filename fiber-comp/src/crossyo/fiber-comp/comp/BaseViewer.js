import { BoxGeometry, Clock, Color, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * base level viewer
 */
export class BaseViewer {

    constructor({ container }) {

        this.container_ = container
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
        this.scene_.background = new Color(0x6699cc)

        this.on_resize__ = () => {
            this.resize_()
        }
        window.addEventListener('resize', this.on_resize__)
        this.resize_()

        { // object for debug
            let m = new Mesh(
                // new SphereGeometry(),
                new BoxGeometry(),
                new MeshStandardMaterial({
                    color: 0xff0000,
                }))
            this.scene_.add(m)
        }

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


}