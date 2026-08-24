import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import LearnView from '../views/LearnView.vue';
import TruthTableView from '../views/TruthTableView.vue';
import LogicLawsView from '../views/LogicLawsView.vue';
import ExercisesView from '../views/ExercisesView.vue';
import ExerciseRunnerView from '../views/ExerciseRunnerView.vue';
import ProgressView from '../views/ProgressView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/aprender', name: 'learn', component: LearnView },
    { path: '/tablas-de-verdad', name: 'truth-tables', component: TruthTableView },
    { path: '/leyes-logicas', name: 'logic-laws', component: LogicLawsView },
    { path: '/ejercicios', name: 'exercises', component: ExercisesView },
    { path: '/ejercicios/:id', name: 'exercise-runner', component: ExerciseRunnerView, props: true },
    { path: '/progreso', name: 'progress', component: ProgressView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
