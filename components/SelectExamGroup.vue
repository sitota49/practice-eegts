<template>
  <div class="items-center justify-center w-screen h-screen bg-white">
   <TopBar />
    <div v-if="examGroups" >
     
      <h1 class="ml-60  mt-20 my-10 text-3xl text-center mx-auto ">Please select a pack to continue</h1>
<div class="grid grid-cols-3 gap-6 w-3/4 mx-auto">
  <div v-for="examGroup in examGroups" >
    <NuxtLink :to="`/${examGroup.id}`">
      <div
        class="drop-shadow-xl rounded-xl border border-gray-100 items-center justify-center text-center w-full hover:bg-blue-100">
        <div
          class=" text-gray-400 border border-blue-100 flex flex-col p-4 h-full rounded-xl cursor-pointer items-center">
          <h1 class="py-5 text-xl font-medium  justify-center align-middle text-black ">
            {{examGroup.name}}
          </h1>
        </div>
      </div>
    </NuxtLink>
  </div>
  

</div>

    </div>
    <div v-else class="w-full text-center text-lg mt-10 h-full">
                                  
      <p>Something went wrong, please refresh the page and try again</p>
    </div>
    

  </div>
</template>

<script setup lang="ts">

const { $client } = useNuxtApp();
const {data: examGroups} = await useAsyncData(() => $client.examGroup.getExamGroups.query());

</script>
