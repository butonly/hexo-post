
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')

exports.g = function g(configFilePaths, hexoRepoPath, options) {
    options = options || {}

    const configFileContents = [
        path.join(configFilePaths, 'hexo.yaml')
    ].map((configFilePath) => fs.readFileSync(configFilePath, 'utf8'))
    
    const configs = yaml.safeLoadAll(configFileContents)
    
    configs.forEach((config) => {
        config.posts.forEach((post, index) => {
            log(configFilePaths, post.path, path.join(configFilePaths, post.path))
            let content = fs.readFileSync(path.join(configFilePaths, post.path)).toString().replace(/#.*$/im, '')

            log()
            log(path.join(hexoRepoPath, `source/_posts/${post.title}.md`))
            
            let imageRegexpExec
            const imageRegexp = /!\[(.*)\]\(([^(http(?s))])\)/gim
            while (imageRegexpExec = imageRegexp.exec(content)) {
                const imageBaseUrl = post.imageBaseUrl || config.imageBaseUrl
                const newImagePath = (imageBaseUrl + imageRegexpExec[2]) || ''
                log(imageRegexpExec[0], ' -> ', `![${imageRegexpExec[1]}](${newImagePath})`)
                content = content.replace(imageRegexpExec[0], `![${imageRegexpExec[1]}](${newImagePath})`)
            }
    
            const tags = Array.isArray(post.tags) ? post.tags : (post.tags || '').split(' ')
            const categories = Array.isArray(post.categories) ? post.categories : (post.categories || '未分类').split(' ')
    
            const footer = config.repository ? `<a href="${config.repository}/tree/master/${post.path}" >查看源文件</a>&nbsp;&nbsp;<a href="${config.repository}/edit/master/${post.path}">编辑源文件</a>` : ''

            content = ''
                + '---\n' 
                + `title: ${post.title}\n`
                + `date: ${new Date(post.date).toISOString()}\n`
                + `updated: ${new Date().toISOString()}\n`
                + `tags: [${tags.toString()}]\n`
                + `categories: [${categories.toString()}]\n`
                + `---`
                + `\n\n`
                + content
                + `\n\n`
                + `---`
                + `\n\n`
                + footer
                + `\n`

            const postPath = (() => {
                if (config.PATH_MODE === 'TREE') {
                    return post.path
                }
                else if (config.PATH_MODE === 'TILED') {
                    return path.basename(post.path)
                }
                else {
                    return post.path
                }
            })()

            const dst = path.join(hexoRepoPath, `source/_posts/${postPath}.md`)
            mkdirp.sync(path.dirname(dst))
            fs.writeFileSync(dst, content, {encoding: 'utf8'})
        })
    })
    
    function log(...args) {
        if (options.verbose) {
            console.log(...args)
        }
    }
}
