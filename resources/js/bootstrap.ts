import axios from "axios";

// Configure axios
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

// Configure progress indicator
// import { InertiaProgress } from "@inertiajs/progress";
// InertiaProgress.init();
