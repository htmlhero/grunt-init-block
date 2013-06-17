getBemClasses.js
========================

Generates css file structure according to classes used in HTML. Relies on BEM naming for classes.

How to use
------------------------

Сall on the command line

	node getbemclasses.js test/index.html post

will return to you

	.post {

    }
    	.post__title {

    	}
    	.post__content1 {

    	}
    	.post__content2 {

    	}
    	.post__meta {

    	}
    	.post__meta._meta-modifier {

    	}
    	.post__tags {

    	}
    	.post__comments {

    	}
    .post._post-modifier {

    }