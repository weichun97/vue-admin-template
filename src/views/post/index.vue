<template>
    <div class="app-container">
      <!-- 搜索 -->
      <div class="filter-container">
        <el-input v-model="listParam.name" placeholder="测试" style="width: 200px;" clearable class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleResetQuery">
          重置
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
      </div>
  
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
                <el-table-column label="岗位编码">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column label="岗位名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="显示顺序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">
            {{ scope.row.createBy }}
          </template>
        </el-table-column>
        <el-table-column label="更新者">
          <template slot-scope="scope">
            {{ scope.row.updateBy }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <Pagination :total="total" :page.sync="listParam.current" :limit.sync="listParam.size" @pagination="fetchData" />
  
      <!-- 新增更新弹框 -->
      <el-dialog :title="saveOrUpdateFormTitile" :visible.sync="saveOrUpdateFormVisible">
        <el-form
          :ref="saveOrUpdateFormRef"
          :model="saveOrUpdateForm"
          status-icon
          :rules="saveOrUpdateFormRules"
          label-width="100px"
        >
          <el-form-item label="岗位编码" prop="code">
            <el-input
              v-model="saveOrUpdateForm.code"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="岗位名称" prop="name">
            <el-input
              v-model="saveOrUpdateForm.name"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="sort">
            <el-input
              v-model="saveOrUpdateForm.sort"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="saveOrUpdateForm.remark"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="创建者" prop="createBy">
            <el-input
              v-model="saveOrUpdateForm.createBy"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="更新者" prop="updateBy">
            <el-input
              v-model="saveOrUpdateForm.updateBy"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="saveOrUpdateLoading"
              @click="saveOrUpdatePost()"
            >提交</el-button>
            <el-button @click="saveOrUpdateFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { query, save, update, remove } from '@/api/post'
  import Pagination from '@/components/Pagination'
  import { showDeleteDialog, showSuccessDialog } from '@/utils/common'
  
  export default {
    components: {
      Pagination
    },
    data() {
      return {
        // 分页
        total: 0,
        listParam: {
          current: 1,
          size: 10
        },
        list: [],
        listLoading: true,
        // 新增、修改
        saveOrUpdateLoading: false,
        saveOrUpdateFormRef: 'saveOrUpdateFormRef',
        saveOrUpdateFormTitile: '新增',
        saveOrUpdateFormVisible: false,
        updateId: null,
        saveOrUpdateForm: {
          name: null
        },
        saveOrUpdateFormRules: {
          name: [
            { required: true, message: '请输入模板名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 分页
      handleFilter() {
        this.fetchData()
      },
      handleResetQuery() {
        this.listParam = {
          current: 1,
          size: 10
        }
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        query(this.listParam).then((response) => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 新增、编辑
      handleEdit(row) {
        this.saveOrUpdateFormTitile = '编辑'
        this.updateId = row.id
        this.saveOrUpdateForm = Object.assign({}, row)
        this.saveOrUpdateFormVisible = true
      },
      handleCreate() {
        this.saveOrUpdateFormTitile = '新增'
        this.updateId = null
        this.saveOrUpdateForm = {}
        this.saveOrUpdateFormVisible = true
      },
      updatePost() {
        this.saveOrUpdateLoading = true
        update(this.saveOrUpdateForm, this.updateId).then(() => {
          this.saveOrUpdateForm = {}
          this.saveOrUpdateFormVisible = false
          this.fetchData()
          showSuccessDialog(this)
          this.saveOrUpdateLoading = false
        }).catch(() => {
          this.saveOrUpdateLoading = false
        })
      },
      savePost() {
        this.saveOrUpdateLoading = true
        save(this.saveOrUpdateForm).then(() => {
          this.saveOrUpdateForm = {}
          this.saveOrUpdateFormVisible = false
          this.fetchData()
          showSuccessDialog(this)
          this.saveOrUpdateLoading = false
        }).catch(() => {
          this.saveOrUpdateLoading = false
        })
      },
      saveOrUpdatePost() {
        this.$refs[this.saveOrUpdateFormRef].validate((valid) => {
          if (valid) {
            this.updateId == null ? this.savePost() : this.updatePost()
          }
        })
      },
      // 删除
      handleDelete(row) {
        showDeleteDialog(this, () => {
          remove(row.id).then(() => {
            this.fetchData()
            showSuccessDialog(this)
          })
        })
      }
    }
  }
</script>