window.addEventListener("load", main, false)

function main() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const height = canvas.height;
    const width = canvas.width;

    const a = width / 16;
    const D = 1 / 100 * a;

    let div = null;
    let n = null;
    let vx0 = null;
    let vy0 = null;
    let r = null;
	let A = null;

    const xc = 200;
    const yc = 300;
    let x = [];
    let y = [];
    let vx = [];
    let vy = [];

    let fr = null;

    let rm = 2;
    let alpha = null;

    let an = null;

    let fps = 30;
    let dt = 1 / fps;


    function draw(k) {
        ctx.beginPath();
        ctx.arc(x[k], y[k], rm, 0, 2 * Math.PI);

        if ((k !== 0) && (k !== n)) {
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[k + 1], y[k + 1]);
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[k - 1], y[k - 1]);
        } else if (k === 0) {
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[1], y[1]);
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[n], y[n])
        } else if (k === n) {
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[0], y[0]);
            ctx.moveTo(x[k], y[k]);
            ctx.lineTo(x[n - 1], y[n - 1])
        }
        ctx.stroke();
    }


    function Control() {
        phys();

        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < div; i++) {
            draw(i);
        }
    }

    let wt = 10;
    let ti = Math.pow(dt, 2) * wt;

    function norm(l, m) {
        return Math.sqrt(Math.pow(x[m] - x[l], 2) + Math.pow(y[m] - y[l], 2));
    }

    function abs(l, m) {
        return x[m] - x[l];
    }

    function ord(l, m) {
        return y[m] - y[l];
    }

    function area() {
        A = 1 / 2 * y[0] * abs(1, n);
        for (let k = 1; k <= div - 2; k++) {
            A = A + 1 / 2 * y[k] * abs(k + 1, k - 1);
        }
        A = A + 1 / 2 * y[n] * abs(1, n - 1);
        return A;
    }

	let A0 = null;

    function phys() {
        // debugger
        vx[0] = vx[0] - (1 - an / norm(1, 0)) * abs(1, 0) - (1 - an / norm(n, 0)) * abs(n, 0) - 1 / 2 * (area() / A0 - 1) * (ord(1, 0) / norm(1, 0) + ord(n, 0) / norm(n, 0)) + fr[0];
        vy[0] = vy[0] - (1 - an / norm(1, 0)) * ord(1, 0) - (1 - an / norm(n, 0)) * ord(n, 0) + 1 / 2 * (area() / A0 - 1) * (abs(1, 0) / norm(1, 0) + abs(n, 0) / norm(n, 0));

        for (let k = 1; k <= div - 2; k++) {
            vx[k] = vx[k] - (1 - an / norm(k + 1, k)) * abs(k + 1, k) - (1 - an / norm(k - 1, k)) * abs(k - 1, k) - 1 / 2 * (area() / A0 - 1) * (ord(k + 1, k) / norm(k + 1, k) + ord(k - 1, k) / norm(k - 1, k)) + fr[k];
            vy[k] = vy[k] - (1 - an / norm(k + 1, k)) * ord(k + 1, k) - (1 - an / norm(k - 1, k)) * ord(k - 1, k) + 1 / 2 * (area() / A0 - 1) * (abs(k + 1, k) / norm(k + 1, k) + abs(k - 1, k) / norm(k - 1, k));
        }

        vx[n] = vx[n] - (1 - an / norm(0, n)) * abs(0, n) - (1 - an / norm(n - 1, n)) * abs(n - 1, n) - 1 / 2 * (area() / A0 - 1) * (ord(0, n) / norm(0, n) + ord(n - 1, n) / norm(n - 1, n)) + fr[n];
        vy[n] = vy[n] - (1 - an / norm(0, n)) * ord(0, n) - (1 - an / norm(n - 1, n)) * ord(n - 1, n) + 1 / 2 * (area() / A0 - 1) * (abs(0, n) / norm(0, n) + abs(n - 1, n) / norm(n - 1, n));

        x[0] = x[0] + vx[0] * ti;
        y[0] = y[0] + vy[0] * ti;

        for (let k = 1; k <= div - 2; k++) {
            x[k] = x[k] + vx[k] * ti;
            y[k] = y[k] + vy[k] * ti;
        }

        x[n] = x[n] + vx[n] * ti;
        y[n] = y[n] + vy[n] * ti;

        for (let i = 0; i < div; i++) {
            if (x[i] <= 2 * a) {
                fr[i] = 12 * D / a * (Math.pow((a / x[i]), 13) - Math.pow((a / x[i]), 7));
            } else {
                fr[i] = 0;
            }
        }
    }

    document.getElementById("start").onclick = function () {
        div = Number(document.getElementById("number_of_particles").value);
        n = div - 1;
        r = Number(document.getElementById("radius").value);
        vx0 = Number(-document.getElementById("v0").value);
        vy0 = vx0;
        an = 2 * r * Math.sin(Math.PI / div)
        fr = new Array(div).fill(0);
        alpha = 2 * Math.PI / div;

        for (let i = 0; i < div; i++) {
            x[i] = xc + r * Math.cos(alpha * i);
            y[i] = yc + r * Math.sin(alpha * i);
        }

        for (let i = 0; i < div; i++) {
            vx.push(vx0);
            vy.push(vy0);
        }

        A0 = area();

        setInterval(Control, 1000 * ti);
    }
}
	
	
	
