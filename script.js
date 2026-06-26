class DatePlanner {

    constructor() {

        // ==========================
        // Datos de la cita
        // ==========================

        this.data = {
            accepted: false,
            plan: "",
            food: "",
            date: "",
            time: "",
            message: ""
        };

        // ==========================
        // Orden de las pantallas
        // ==========================

        this.pages = [
            "home",
            "question",
            "plan",
            "food",
            "date",
            "message",
            "finish"
        ];

        // ==========================
        // Página actual
        // ==========================

        this.current = "home";

        // ==========================
        // Inicializar
        // ==========================

        this.init();
    }

    // ==================================
    // Inicio
    // ==================================

    init() {
        this.setupCards();
        this.createToastContainer();
    }

    // ==================================
    // Cambiar pantalla
    // ==================================

    go(id) {
        const active = document.querySelector(".page.active");
        if (active) active.classList.remove("active");

        document.getElementById("p-" + id).classList.add("active");
        this.current = id;
        this.updateProgress();
    }

    // ==================================
    // Barra de progreso
    // ==================================

    updateProgress() {
        const prog = document.getElementById("prog");
        if (!prog) return;

        const index = this.pages.indexOf(this.current);
        const percent = ((index + 1) / this.pages.length) * 100;

        prog.style.width = percent + "%";
        document.getElementById("stepLabel").textContent =
            (index + 1) + " / " + this.pages.length;
    }

    // ==================================
    // Toast
    // ==================================

    createToastContainer() {
        if (document.getElementById("toasts")) return;
        const div = document.createElement("div");
        div.id = "toasts";
        document.body.appendChild(div);
    }

    showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = "toast " + type;
        toast.textContent = message;

        document.getElementById("toasts").appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 30);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    // ==================================
    // Botón "Sí"
    // ==================================

    accept() {
        this.data.accepted = true;
        this.showToast("¡genial! 😊");
        setTimeout(() => this.go("plan"), 600);
    }

    // ==================================
    // Botón "Todavía no sé"
    // ==================================

    notSure() {
        const msg = document.getElementById("notSureMsg");
        const visible = msg.style.display === "block";
        msg.style.display = visible ? "none" : "block";
        if (!visible) {
            this.showToast("no hay prisa, aquí estaré 💚");
        }
    }

    // ==================================
    // Avanzar desde pantallas de tarjetas
    // (valida que se haya elegido algo)
    // ==================================

    goFromCards(group, next) {
        const selected = document.querySelector(
            "#cards-" + group + " .card-opt.selected"
        );

        if (!selected) {
            this.showToast("elige una opción primero 👀", "warn");
            return;
        }

        this.data[group] = selected.dataset.val;
        this.go(next);
    }

    // ==================================
    // Avanzar desde pantalla de fecha
    // (valida que se haya elegido día)
    // ==================================

    goFromDate() {
        const dateVal = document.getElementById("dateInput").value;
        const timeVal = document.getElementById("timeInput").value;

        if (!dateVal) {
            this.showToast("elige un día primero 📅", "warn");
            return;
        }

        this.data.date = dateVal;
        this.data.time = timeVal;
        this.go("message");
    }

    // ==================================
    // Finalizar y mostrar resumen
    // ==================================

    finish() {
        this.data.message = document.getElementById("messageInput").value;
        this.buildSummary();
        this.go("finish");

        // Guardar en Firebase si está disponible
        if (typeof window.saveToFirebase === "function") {
            window.saveToFirebase(this.data);
        }
    }

    // ==================================
    // Construir resumen final
    // ==================================

    buildSummary() {
        const fmtDate = this.data.date
            ? new Date(this.data.date + "T12:00").toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long"
              })
            : "—";

        const fmtTime = this.data.time || "—";

        const items = [
            { label: "plan",   val: this.data.plan  || "—" },
            { label: "comida", val: this.data.food  || "—" },
            { label: "día",    val: fmtDate },
            { label: "hora",   val: fmtTime }
        ];

        const grid = document.getElementById("summaryGrid");

        grid.innerHTML = items.map(item => `
            <div class="summary-item">
                <div class="s-label">${item.label}</div>
                <div class="s-val">${item.val}</div>
            </div>
        `).join("");

        if (this.data.message.trim()) {
            grid.innerHTML += `
                <div class="summary-msg">
                    💬 "${this.data.message}"
                </div>
            `;
        }
    }

    // ==================================
    // Setup: toggle de tarjetas
    // ==================================

    setupCards() {
        document.querySelectorAll(".card-opt").forEach(card => {
            card.addEventListener("click", () => {
                card.closest(".cards")
                    .querySelectorAll(".card-opt")
                    .forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
            });
        });
    }
}

// ==================================
// Instancia global
// ==================================

const planner = new DatePlanner();
window.planner = planner;
