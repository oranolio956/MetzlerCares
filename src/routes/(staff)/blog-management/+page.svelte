<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { blogOperations } from '$lib/utils/sanity';
  
  let posts: any[] = [];
  let pillars: any[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedTab = 'posts';
  let showCreateModal = false;
  let showEditModal = false;
  let editingPost: any = null;
  let creatingPost = false;
  let updatingPost = false;
  let deletingPost = false;
  
  let newPost = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    tags: [] as string[],
    pillar: '',
    publishedAt: '',
    featuredImage: null as any,
    status: 'draft' as 'draft' | 'published'
  };
  
  let tagInput = '';
  let searchQuery = '';
  let filterStatus = 'all';
  let filterPillar = 'all';
  let sortBy = 'publishedAt';
  let sortOrder = 'desc';
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    loading = true;
    error = null;
    try {
      const [postsData, pillarsData] = await Promise.all([
        blogOperations.getBlogPosts({ status: 'all', limit: 100 }),
        blogOperations.getPillarPages()
      ]);
      posts = postsData;
      pillars = pillarsData;
    } catch (e: any) {
      error = e?.message || 'Failed to load blog data';
    } finally {
      loading = false;
    }
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  function addTag() {
    const tag = tagInput.trim();
    if (tag && !newPost.tags.includes(tag)) {
      newPost.tags = [...newPost.tags, tag];
      tagInput = '';
    }
  }
  
  function removeTag(tag: string) {
    newPost.tags = newPost.tags.filter(t => t !== tag);
  }
  
  function openCreateModal() {
    newPost = {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      tags: [],
      pillar: '',
      publishedAt: new Date().toISOString().split('T')[0],
      featuredImage: null,
      status: 'draft'
    };
    showCreateModal = true;
  }
  
  function openEditModal(post: any) {
    editingPost = { ...post };
    showEditModal = true;
  }
  
  async function handleCreatePost() {
    if (!newPost.title || !newPost.slug || !newPost.excerpt) {
      error = 'Title, slug, and excerpt are required';
      return;
    }
    
    creatingPost = true;
    error = null;
    try {
      await blogOperations.createBlogPost(newPost);
      showCreateModal = false;
      await loadData();
    } catch (e: any) {
      error = e?.message || 'Failed to create blog post';
    } finally {
      creatingPost = false;
    }
  }
  
  async function handleUpdatePost() {
    if (!editingPost?.title || !editingPost?.slug || !editingPost?.excerpt) {
      error = 'Title, slug, and excerpt are required';
      return;
    }
    
    updatingPost = true;
    error = null;
    try {
      await blogOperations.updateBlogPost(editingPost._id, editingPost);
      showEditModal = false;
      await loadData();
    } catch (e: any) {
      error = e?.message || 'Failed to update blog post';
    } finally {
      updatingPost = false;
    }
  }
  
  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    deletingPost = true;
    error = null;
    try {
      await blogOperations.deleteBlogPost(postId);
      await loadData();
    } catch (e: any) {
      error = e?.message || 'Failed to delete blog post';
    } finally {
      deletingPost = false;
    }
  }
  
  function viewPost(post: any) {
    window.open(`/blog/${post.slug}`, '_blank');
  }
  
  function previewPost(post: any) {
    window.open(`/blog/${post.slug}?preview=true`, '_blank');
  }
  
  $: filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesPillar = filterPillar === 'all' || post.pillar?.slug === filterPillar;
    
    return matchesSearch && matchesStatus && matchesPillar;
  });
  
  $: sortedPosts = [...filteredPosts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'publishedAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  $: stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    thisMonth: posts.filter(p => {
      const postDate = new Date(p.publishedAt || p._createdAt);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length
  };
</script>

<svelte:head>
  <title>Blog Management - Staff Dashboard</title>
  <meta name="description" content="Manage blog posts, editorial workflow, and content analytics" />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <header class="bg-deep-navy-700 text-soft-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium">Blog Management</h1>
          <p class="text-cream text-opacity-80">Content Creation & Editorial Workflow</p>
        </div>
        <div class="flex items-center space-x-4">
          <button onclick={loadData} class="px-4 py-2 bg-sage-600 text-soft-white rounded-md hover:bg-sage-700 transition-colors">
            Refresh
          </button>
          <button onclick={openCreateModal} class="px-4 py-2 bg-blue-600 text-soft-white rounded-md hover:bg-blue-700 transition-colors">
            New Post
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" role="alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-deep-navy-700">Total Posts</p>
            <p class="text-2xl font-semibold text-deep-navy-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-deep-navy-700">Published</p>
            <p class="text-2xl font-semibold text-deep-navy-900">{stats.published}</p>
          </div>
        </div>
      </div>

      <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-deep-navy-700">Drafts</p>
            <p class="text-2xl font-semibold text-deep-navy-900">{stats.draft}</p>
          </div>
        </div>
      </div>

      <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-deep-navy-700">This Month</p>
            <p class="text-2xl font-semibold text-deep-navy-900">{stats.thisMonth}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-deep-navy-700 mb-2">Search</label>
          <input
            type="text"
            id="search"
            bind:value={searchQuery}
            placeholder="Search posts..."
            class="form-input w-full"
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-deep-navy-700 mb-2">Status</label>
          <select id="status" bind:value={filterStatus} class="form-input w-full">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label for="pillar" class="block text-sm font-medium text-deep-navy-700 mb-2">Pillar</label>
          <select id="pillar" bind:value={filterPillar} class="form-input w-full">
            <option value="all">All Pillars</option>
            {#each pillars as pillar}
              <option value={pillar.slug}>{pillar.title}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="sort" class="block text-sm font-medium text-deep-navy-700 mb-2">Sort By</label>
          <select id="sort" bind:value={sortBy} class="form-input w-full">
            <option value="publishedAt">Publish Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Posts Table -->
    <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 overflow-hidden">
      <div class="px-6 py-4 bg-deep-navy-900 bg-opacity-5 border-b border-deep-navy-200">
        <h2 class="text-xl font-medium text-deep-navy-900">Blog Posts ({sortedPosts.length})</h2>
      </div>

      {#if loading}
        <div class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-deep-navy-700">Loading posts...</p>
        </div>
      {:else if sortedPosts.length === 0}
        <div class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-deep-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-deep-navy-900">No posts found</h3>
          <p class="mt-1 text-sm text-deep-navy-700">Get started by creating your first blog post.</p>
          <div class="mt-6">
            <button onclick={openCreateModal} class="btn-primary">
              Create Post
            </button>
          </div>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-deep-navy-200 divide-opacity-10">
            <thead class="bg-deep-navy-900 bg-opacity-5">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Pillar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Publish Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-soft-white divide-y divide-deep-navy-200 divide-opacity-10">
              {#each sortedPosts as post}
                <tr class="hover:bg-deep-navy-900 hover:bg-opacity-5 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-deep-navy-900">{post.title}</div>
                    <div class="text-sm text-deep-navy-700">{post.excerpt}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-deep-navy-700">
                    {post.author || 'Unknown'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-deep-navy-700">
                    {post.pillar?.title || 'Uncategorized'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-deep-navy-700">
                    {formatDate(post.publishedAt || post._createdAt)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        onclick={() => viewPost(post)}
                        class="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Post"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onclick={() => previewPost(post)}
                        class="text-green-600 hover:text-green-900 transition-colors"
                        title="Preview"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onclick={() => openEditModal(post)}
                        class="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onclick={() => handleDeletePost(post._id)}
                        class="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                        disabled={deletingPost}
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </main>
</div>

<!-- Create Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-soft-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
      <div class="px-6 py-4 border-b border-deep-navy-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-deep-navy-900">Create New Blog Post</h3>
          <button onclick={() => showCreateModal = false} class="text-deep-navy-700 hover:text-deep-navy-900" aria-label="Close modal">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="new-title" class="block text-sm font-medium text-deep-navy-700 mb-2">Title *</label>
            <input
              type="text"
              id="new-title"
              bind:value={newPost.title}
              oninput={() => newPost.slug = generateSlug(newPost.title)}
              class="form-input w-full"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label for="new-slug" class="block text-sm font-medium text-deep-navy-700 mb-2">Slug *</label>
            <input
              type="text"
              id="new-slug"
              bind:value={newPost.slug}
              class="form-input w-full"
              placeholder="post-slug"
            />
          </div>
        </div>
        
        <div>
          <label for="new-excerpt" class="block text-sm font-medium text-deep-navy-700 mb-2">Excerpt *</label>
          <textarea
            id="new-excerpt"
            bind:value={newPost.excerpt}
            rows="3"
            class="form-input w-full"
            placeholder="Brief description of the post"
          ></textarea>
        </div>
        
        <div>
          <label for="new-content" class="block text-sm font-medium text-deep-navy-700 mb-2">Content</label>
          <textarea
            id="new-content"
            bind:value={newPost.content}
            rows="10"
            class="form-input w-full font-mono text-sm"
            placeholder="Write your post content here..."
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="new-author" class="block text-sm font-medium text-deep-navy-700 mb-2">Author</label>
            <input
              type="text"
              id="new-author"
              bind:value={newPost.author}
              class="form-input w-full"
              placeholder="Author name"
            />
          </div>
          <div>
            <label for="new-pillar" class="block text-sm font-medium text-deep-navy-700 mb-2">Pillar</label>
            <select id="new-pillar" bind:value={newPost.pillar} class="form-input w-full">
              <option value="">Select a pillar</option>
              {#each pillars as pillar}
                <option value={pillar._id}>{pillar.title}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <div>
          <label for="new-tags" class="block text-sm font-medium text-deep-navy-700 mb-2">Tags</label>
          <div class="flex space-x-2 mb-2">
            <input
              type="text"
              id="new-tags"
              bind:value={tagInput}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              class="form-input flex-1"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onclick={addTag}
              class="px-4 py-2 bg-sage-600 text-soft-white rounded-md hover:bg-sage-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each newPost.tags as tag}
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-deep-navy-100 text-deep-navy-800">
                {tag}
                <button
                  type="button"
                  onclick={() => removeTag(tag)}
                  class="ml-2 text-deep-navy-600 hover:text-deep-navy-800"
                  aria-label="Remove tag {tag}"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="new-published-date" class="block text-sm font-medium text-deep-navy-700 mb-2">Publish Date</label>
            <input
              type="date"
              id="new-published-date"
              bind:value={newPost.publishedAt}
              class="form-input w-full"
            />
          </div>
          <div>
            <label for="new-status" class="block text-sm font-medium text-deep-navy-700 mb-2">Status</label>
            <select id="new-status" bind:value={newPost.status} class="form-input w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-deep-navy-200 flex justify-end space-x-3">
        <button
          onclick={() => showCreateModal = false}
          class="px-4 py-2 text-deep-navy-700 hover:text-deep-navy-900 transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleCreatePost}
          disabled={creatingPost}
          class="px-4 py-2 bg-blue-600 text-soft-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {creatingPost ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingPost}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-soft-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
      <div class="px-6 py-4 border-b border-deep-navy-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-deep-navy-900">Edit Blog Post</h3>
          <button onclick={() => showEditModal = false} class="text-deep-navy-700 hover:text-deep-navy-900" aria-label="Close modal">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-deep-navy-700 mb-2">Title *</label>
            <input
              type="text"
              id="edit-title"
              bind:value={editingPost.title}
              class="form-input w-full"
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label for="edit-slug" class="block text-sm font-medium text-deep-navy-700 mb-2">Slug *</label>
            <input
              type="text"
              id="edit-slug"
              value={editingPost.slug?.current || editingPost.slug}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                if (editingPost.slug?.current) {
                  editingPost.slug.current = target.value;
                } else {
                  editingPost.slug = target.value;
                }
              }}
              class="form-input w-full"
              placeholder="post-slug"
            />
          </div>
        </div>
        
        <div>
          <label for="edit-excerpt" class="block text-sm font-medium text-deep-navy-700 mb-2">Excerpt *</label>
          <textarea
            id="edit-excerpt"
            bind:value={editingPost.excerpt}
            rows="3"
            class="form-input w-full"
            placeholder="Brief description of the post"
          ></textarea>
        </div>
        
        <div>
            <label for="edit-content" class="block text-sm font-medium text-deep-navy-700 mb-2">Content</label>
            <textarea
              id="edit-content"
              value={editingPost.content?.[0]?.children?.[0]?.text || editingPost.content || ''}
              oninput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                if (editingPost.content?.[0]?.children?.[0]) {
                  editingPost.content[0].children[0].text = target.value;
                } else {
                  editingPost.content = target.value;
                }
              }}
              rows="10"
              class="form-input w-full font-mono text-sm"
              placeholder="Write your post content here..."
            ></textarea>
          </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="edit-author" class="block text-sm font-medium text-deep-navy-700 mb-2">Author</label>
            <input
              type="text"
              id="edit-author"
              value={editingPost.author?.name || editingPost.author || ''}
              oninput={(e) => {
                const target = e.target as HTMLInputElement;
                if (editingPost.author?.name) {
                  editingPost.author.name = target.value;
                } else {
                  editingPost.author = target.value;
                }
              }}
              class="form-input w-full"
              placeholder="Author name"
            />
          </div>
          <div>
            <label for="edit-pillar" class="block text-sm font-medium text-deep-navy-700 mb-2">Pillar</label>
            <select 
              id="edit-pillar" 
              value={editingPost.pillarPage?._ref || editingPost.pillar || ''} 
              onchange={(e) => {
                const target = e.target as HTMLSelectElement;
                if (editingPost.pillarPage) {
                  editingPost.pillarPage._ref = target.value;
                } else {
                  editingPost.pillar = target.value;
                }
              }}
              class="form-input w-full"
            >
              <option value="">Select a pillar</option>
              {#each pillars as pillar}
                <option value={pillar._id}>{pillar.title}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="edit-published-date" class="block text-sm font-medium text-deep-navy-700 mb-2">Publish Date</label>
            <input
              type="date"
              id="edit-published-date"
              value={editingPost.publishedAt ? new Date(editingPost.publishedAt).toISOString().split('T')[0] : ''}
              oninput={(e) => {
                const target = e.target as HTMLInputElement;
                editingPost.publishedAt = target.value ? new Date(target.value).toISOString() : '';
              }}
              class="form-input w-full"
            />
          </div>
          <div>
            <label for="edit-status" class="block text-sm font-medium text-deep-navy-700 mb-2">Status</label>
            <select 
              id="edit-status" 
              value={editingPost.isPublished ? 'published' : 'draft'} 
              onchange={(e) => {
                const target = e.target as HTMLSelectElement;
                editingPost.isPublished = target.value === 'published';
              }}
              class="form-input w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-deep-navy-200 flex justify-end space-x-3">
        <button
          onclick={() => showEditModal = false}
          class="px-4 py-2 text-deep-navy-700 hover:text-deep-navy-900 transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleUpdatePost}
          disabled={updatingPost}
          class="px-4 py-2 bg-blue-600 text-soft-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {updatingPost ? 'Updating...' : 'Update Post'}
        </button>
      </div>
    </div>
  </div>
{/if}