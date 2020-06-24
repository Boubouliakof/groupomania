<template>
    <div>
        <h2>
            Charte en cours de rédaction avec la direction
        </h2>
        <span class="animation"></span>
        <span class="animation"></span>
        <span class="animation"></span>
        <span class="animation"></span>
    </div>
</template>

<script>
export default {
    name:"charte"
}
</script>

<style>

.animation {
  width: 30px;
  height: 30px;
  position: absolute;
  background-color: #212529;
    -webkit-animation: move 4s 100ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
        animation: move 4s 100ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
  border-radius: 50%;
}

.animation:nth-child(1) {
  background-color: #212529;
  -webkit-animation: move 4s 200ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
          animation: move 4s 200ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
}

.animation:nth-child(2) {
  background-color: #212529;
  -webkit-animation: move 4s 400ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
          animation: move 4s 400ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
}

.animation:nth-child(3) {
  background-color: #212529;
  -webkit-animation: move 4s 600ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
          animation: move 4s 600ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
}

.animation:nth-child(4) {
  background-color: #212529;
  -webkit-animation: move 4s 800ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
          animation: move 4s 800ms infinite cubic-bezier(0.2, 0.64, 0.81, 0.23);
}
@-webkit-keyframes move {
  0% {
    left: 5%;
  }
  100% {
    left: 90%;
  }
}

@keyframes move {
  0% {
    left: 5%;
  }
  100% {
    left: 90%;
  }
}

</style>