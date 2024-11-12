
export class DeviceUtils {

    private static _IsMobile: boolean;

    private static _IsApple(): boolean {
        return /iPad/i.test(navigator.userAgent) || /Macintosh/i.test(navigator.userAgent);
    }

    private static _HasTouch(): boolean {
        // Check if the device has touch capability
        return ('maxTouchPoints' in navigator) && navigator.maxTouchPoints > 0;
    }

    public static Init() {

        const testExp = new RegExp('Android|webOS|iPhone|iPad|' +
            'BlackBerry|Windows Phone|' +
            'Opera Mini|IEMobile|Mobile',
            'i');
        if (testExp.test(navigator.userAgent)) {
            this._IsMobile = true;
        } else if (this._IsApple() && this._HasTouch()) {
            this._IsMobile = true;
        } else {
            this._IsMobile = false;
        }
    }


    static get IsMobile(): boolean { this.Init(); return this._IsMobile; }
}