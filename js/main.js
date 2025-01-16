document.addEventListener('DOMContentLoaded', async function() {
    // 获取初始点赞数
    async function fetchLikes() {
        const query = new AV.Query('Likes');
        const results = await query.find();
        const likesMap = {};
        results.forEach(like => {
            likesMap[like.get('workId')] = like.get('count');
        });
        return likesMap;
    }

    // 更新点赞数
    async function updateLikes(workId, count) {
        const query = new AV.Query('Likes');
        query.equalTo('workId', workId);
        let like = await query.first();
        
        if (!like) {
            // 如果不存在则创建新记录
            const Like = AV.Object.extend('Likes');
            like = new Like();
            like.set('workId', workId);
        }
        
        like.set('count', count);
        await like.save();
    }

    // 获取初始点赞数据
    const likesData = await fetchLikes();
    
    // 更新作品数据中的点赞数
    worksData.forEach(work => {
        work.likes = likesData[work.id] || 0;
    });

    // 生成作品卡片
    const showcaseContainer = document.querySelector('.showcase-container');
    showcaseContainer.innerHTML = '';
    
    worksData.forEach(work => {
        const workCard = `
            <div class="work-card" data-work-id="${work.id}">
                <div class="author-info">
                    <img src="${work.avatarPath}" alt="${work.author}的头像" class="avatar">
                    <span class="author-name">${work.author}</span>
                </div>
                <div class="work-content">
                    <img src="${work.workPath}" alt="${work.workTitle}" class="work-image">
                </div>
                <div class="work-title">${work.workTitle}</div>
                <div class="interaction-bar">
                    <div class="comments">
                        <span class="comment-icon">💬</span>
                        <span class="count">${work.comments}</span>
                    </div>
                    <div class="likes">
                        <button class="like-button">👍</button>
                        <span class="count">${work.likes}</span>
                    </div>
                </div>
            </div>
        `;
        showcaseContainer.innerHTML += workCard;
    });

    // 点赞功能
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const workCard = this.closest('.work-card');
            const workId = workCard.dataset.workId;
            const countElement = this.nextElementSibling;
            let count = parseInt(countElement.textContent);
            count++;
            countElement.textContent = count;
            
            try {
                await updateLikes(workId, count);
            } catch (error) {
                console.error('更新点赞数失败:', error);
                // 可以添加错误提示
            }
        });
    });
}); 