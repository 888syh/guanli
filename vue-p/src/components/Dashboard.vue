<template>
    <div class="dashboard-container">
        <el-card class="table-card">
            <el-table :data="workOrders" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="project" label="Project" />
                <el-table-column prop="overtime" label="Overtime" width="120">
                    <template #default="{ row }">
                        <el-tag :type="row.overtime ? 'danger' : 'success'">
                            {{ row.overtime ? 'Yes' : 'No' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="hours" label="Hours" width="100" />
                <el-table-column prop="created_at" label="Created At" width="180" />
                <el-table-column label="Operations" width="120" v-if="isAdmin">
                    <template #default="{ $index }">
                        <el-button type="danger" size="small" icon="Delete" @click="handleDelete($index)">
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-card class="chart-card">
            <div ref="chartRef" style="height: 400px;"></div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUserRole } from '@/utils/auth'
import { workOrders as initialOrders } from '@/mockData'
import * as echarts from 'echarts'

const router = useRouter()
const workOrders = ref([...initialOrders])
const chartRef = ref(null)
let chartInstance = null

const isAdmin = computed(() => {
    return getUserRole() === 'admin'
})

// 计算图表数据
const chartData = computed(() => {
    const projects = {}

    workOrders.value.forEach(order => {
        if (!projects[order.project]) {
            projects[order.project] = 0
        }
        projects[order.project] += order.hours
    })

    return {
        projects: Object.keys(projects),
        hours: Object.values(projects)
    }
})

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return

    chartInstance = echarts.init(chartRef.value)
    updateChart()
}

// 更新图表
const updateChart = () => {
    if (!chartInstance) return

    const option = {
        title: {
            text: 'Project Hours Distribution',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: chartData.value.projects,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: 'Hours'
        },
        series: [{
            name: '工时',
            type: 'bar',
            data: chartData.value.hours,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 1, color: '#188df0' }
                ])
            }
        }],
        grid: {
            top: '15%',
            left: '3%',
            right: '3%',
            bottom: '15%',
            containLabel: true
        }
    }

    chartInstance.setOption(option)
}

// 删除工单
const handleDelete = (index) => {
    workOrders.value.splice(index, 1)
}

// 监听数据变化
watch(chartData, () => {
    updateChart()
})

onMounted(() => {
    if (!getUserRole()) {
        router.push('/')
    }
    initChart()
    window.addEventListener('resize', () => {
        chartInstance?.resize()
    })
})
</script>

<style scoped>
.dashboard-container {
    display: flex;
    padding: 20px;
    width: 80%;
    margin: 0 auto;
}

.chart-card,
.table-card {
    width: 50%;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>