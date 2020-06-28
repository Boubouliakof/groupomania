<template>
    <div id="footer">
        <p>
            <img src="@/assets/logos/icon-left-font-monochrome-white.svg" height="25" alt="logo groupomania">     
            || 2020 
        </p>
    </div>
</template>

<style>

#footer{
  padding-top:20px;
  margin-top:20px;
  font-weight: 500;
  font-size: 1.2em;
  bottom: 0;
  width: 100%;
  color:white;
  background-color:#212529;
  display:flex;
  align-items:center;
  justify-content: center;
}
@media only screen and (min-width: 800px) {
    #footer{
        position: sticky;
    }
}
</style>