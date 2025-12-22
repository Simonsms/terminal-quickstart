<template>
  <div class="snippet-manage">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">Snippets</h2>
        <span class="snippet-count">{{ snippetStore.snippetCount }} total</span>
      </div>
      <div class="header-right">
        <el-input
          v-model="snippetStore.searchQuery"
          placeholder="Search snippets..."
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-button type="primary" @click="handleAdd" :icon="Plus">
          New Snippet
        </el-button>
      </div>
    </div>

    <!-- 分类过滤器 -->
    <div v-if="snippetStore.categories.length > 0" class="category-filter">
      <el-tag
        :type="snippetStore.selectedCategory === null ? 'primary' : ''"
        class="category-tag"
        @click="snippetStore.selectedCategory = null"
      >
        All
      </el-tag>
      <el-tag
        v-for="category in snippetStore.categories"
        :key="category"
        :type="snippetStore.selectedCategory === category ? 'primary' : ''"
        class="category-tag"
        @click="snippetStore.selectedCategory = category"
      >
        {{ category }}
      </el-tag>
    </div>

    <!-- 空状态 -->
    <div v-if="snippetStore.snippets.length === 0" class="empty-state">
      <div class="empty-icon">
        <el-icon :size="64">
          <Document />
        </el-icon>
      </div>
      <p class="empty-text">No snippets yet</p>
      <p class="empty-hint">Click "New Snippet" to create your first snippet</p>
    </div>

    <!-- 无搜索结果 -->
    <div
      v-else-if="snippetStore.filteredSnippets.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        <el-icon :size="64">
          <Search />
        </el-icon>
      </div>
      <p class="empty-text">No results found</p>
      <p class="empty-hint">Try a different search term or category</p>
    </div>

    <!-- 句子网格 -->
    <div v-else class="snippet-grid">
      <SnippetCard
        v-for="(snippet, index) in snippetStore.filteredSnippets"
        :key="snippet.id"
        :snippet="snippet"
        :style="{ 'animation-delay': `${index * 0.05}s` }"
        @copy="handleCopy(snippet.id)"
        @edit="handleEdit(snippet)"
        @delete="handleDelete(snippet)"
      />
    </div>

    <SnippetForm
      v-model:visible="formVisible"
      :snippet="editingSnippet"
      :categories="snippetStore.categories"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Document, Search } from "@element-plus/icons-vue";
import SnippetCard from "../components/SnippetCard.vue";
import SnippetForm from "../components/SnippetForm.vue";
import { useSnippetStore } from "../stores/snippetStore";
import type { SnippetConfig, SnippetFormData } from "../types/snippet";

const snippetStore = useSnippetStore();

const formVisible = ref(false);
const editingSnippet = ref<SnippetConfig | null>(null);

onMounted(async () => {
  await snippetStore.loadConfig();
});

const handleAdd = () => {
  editingSnippet.value = null;
  formVisible.value = true;
};

const handleEdit = (snippet: SnippetConfig) => {
  editingSnippet.value = snippet;
  formVisible.value = true;
};

const handleSubmit = async (data: SnippetFormData) => {
  try {
    if (editingSnippet.value) {
      await snippetStore.updateSnippet(editingSnippet.value.id, data);
      ElMessage.success("Snippet updated successfully");
    } else {
      await snippetStore.addSnippet(data);
      ElMessage.success("Snippet created successfully");
    }
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("Operation failed");
  }
};

const handleCopy = async (id: string) => {
  try {
    await snippetStore.copyToClipboard(id);
    ElMessage.success("Copied to clipboard");
  } catch (error) {
    console.error("复制失败:", error);
    ElMessage.error("Copy failed");
  }
};

const handleDelete = async (snippet: SnippetConfig) => {
  try {
    await ElMessageBox.confirm(
      `Delete snippet "${snippet.title}"?`,
      "Confirm deletion",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    );
    await snippetStore.deleteSnippet(snippet.id);
    ElMessage.success("Snippet deleted successfully");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("Delete failed");
    }
  }
};
</script>

<style scoped>
.snippet-manage {
  width: 100%;
  height: 100%;
  padding: 32px 40px;
  overflow-y: auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--tokyo-text-bright);
  margin: 0;
}

.snippet-count {
  font-size: 14px;
  font-weight: var(--font-weight-normal);
  color: var(--tokyo-text-dim);
  padding: 4px 12px;
  background: var(--tokyo-bg-card);
  border-radius: 12px;
  border: 1px solid var(--tokyo-border);
}

.search-input {
  width: 280px;
}

/* 分类过滤器 */
.category-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--tokyo-border);
  flex-wrap: wrap;
}

.category-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.category-tag:hover {
  transform: scale(1.05);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-icon {
  color: var(--tokyo-text-muted);
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  color: var(--tokyo-text);
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--tokyo-text-dim);
  margin: 0;
}

/* 句子网格 */
.snippet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .snippet-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

@media (max-width: 768px) {
  .snippet-manage {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .snippet-grid {
    grid-template-columns: 1fr;
  }
}
</style>
