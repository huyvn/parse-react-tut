Parse.initialize("YOUR APP ID", "YOUR JS KEY");

var CommentBox = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(){
    return {
      comments: (new Parse.Query('Comment')).ascending('createdAt')
    };
  },
  handleCommentSubmit: function(comment){
    var comments = this.data.comments;
    var newComments = comments.concat([comment]);
    var newComment = ParseReact.Mutation.Create('Comment', comment).dispatch();
  },
  componentDidMount: function () {
    setInterval(this.observe, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.data.comments}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  },
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment, index){
      return (
        <Comment author={comment.author} key={index}>{comment.text}</Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author= React.findDOMNode(this.refs.author).value.trim();
    var text= React.findDOMNode(this.refs.text).value.trim();
    if(!text || !author){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function(){
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your Name" ref="author"/>
        <input type="text" placeholder="Say something ..." ref="text"/>
        <input type="submit" value="Post"/>
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

React.render(
  <CommentBox pollInterval={2000}/>,
  document.getElementById('content')
);