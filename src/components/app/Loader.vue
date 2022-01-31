<template>
  <div class="app-loader">
    <div class="preloader">
      <div class="loader-item">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>

<style>

.preloader {
  width: 100%;
  height: 100%;
  z-index: 999;
}

.loader-item {
  width: 100%;
  height: 100%;
}
.app-loader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

}
.loader {
  width: 30px;
  height: 30px;
  position: relative;
  margin: auto;
}
.loader::before,
.loader::after {
  content: "";
  position: absolute;
}

.loader-item {
  display: flex;
  background: var(--mainBG);
}
.loader::before,
.loader::after {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  top: calc(50% - 5px);
  left: calc(50% - 5px);
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
.loader::before {
  background: #6769EA;
  -webkit-animation-name: droplets;
  animation-name: droplets;
}
.loader::after {
  border: 1px solid #6769EA;
  opacity: 0;
  -webkit-animation-name: ripples;
  animation-name: ripples;
}

@-webkit-keyframes droplets {
  0%,
  15% {
    opacity: 1;
  }
  15% {
    transform: scale(0.5);
  }
  60% {
    transform: scale(4);
  }
  60%,
  90% {
    opacity: 0;
  }
  90% {
    transform: scale(3);
  }
  95%,
  100% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes droplets {
  0%,
  15% {
    opacity: 1;
  }
  15% {
    transform: scale(0.5);
  }
  60% {
    transform: scale(4);
  }
  60%,
  90% {
    opacity: 0;
  }
  90% {
    transform: scale(3);
  }
  95%,
  100% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes ripples {
  0%,
  30% {
    opacity: 0;
    transform: scale(1);
  }
  60% {
    opacity: 0.3;
  }
  90% {
    transform: scale(3);
  }
  100% {
    opacity: 0;
  }
}
@keyframes ripples {
  0%,
  30% {
    opacity: 0;
    transform: scale(1);
  }
  60% {
    opacity: 0.3;
  }
  90% {
    transform: scale(3);
  }
  100% {
    opacity: 0;
  }
}
</style>

<script>
export default {
  computed: {
    color() {
      const colors = ["grey", "white", "black", "red"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
};
</script>