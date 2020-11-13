<template>
  <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
</template>

<script>
export default {
  name: "BarChart",
  data() {
    this.extend = {
      series: {
        label: { show: true, position: "top" }
      }
    }
    return {
      chartData: {
        columns: ['日期', '访问量', '被访问量'],
        rows: [
          {'日期': 'Mon', '访问量': 1393, '被访问量': 1516},
          {'日期': 'Tue', '访问量': 3530, '被访问量': 869},
          {'日期': 'Wed', '访问量': 2923, '被访问量': 452},
          {'日期': 'Thu', '访问量': 1723, '被访问量': 134},
          {'日期': 'Fri', '访问量': 3792, '被访问量': 745},
          {'日期': 'Sat', '访问量': 4593, '被访问量': 1546},
          {'日期': 'Sun', '访问量': 4593, '被访问量': 6874}
        ],
      }
    }
  }
}
</script>

<style scoped>

</style>
