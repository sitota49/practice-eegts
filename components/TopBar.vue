<template>
    <div class="w-screen">
        <div class="mx-10">
            <div class=" mt-4 bg-blue-100 h-10 rounded-lg shadow-md bg-cover bg-center w-11/12 mx-auto">
            </div>
            <div class="flex flex-row bg-primary mx-auto -mt-8 rounded-xl h-14 items-center space-x-auto">

                <NuxtLink :to="`/`">
                    <div class="flex flex-row items-center">
                        <img src="@/assets/images/whitelogo.png" class="w-8 m-6" />
                        <h1 class="text-2xl my-auto text-white">EEGTS</h1>
                    </div>
                </NuxtLink>

            </div>
        </div>

    </div>
</template>
<script>
export default {
    components: {},
    name: 'AdminTopBar',
    props: {
        role: String,
        id: String
    },
}
</script>