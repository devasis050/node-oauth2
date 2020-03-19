Reference: https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js/

There are three parties in any OAuth flow:

The client - The person, or user who is logging in
The consumer - The application that the client wants to log in to (which was gitlab in the above image)
The service provider - The external application through which the user authenticates. (which was github in the above image)


In our case 
client: End user
Consumer: localhost:8080
Service provider: facebook

Pre requisite :
Consumer needs to register at service provider and obtain 
1.	client_id
2.	client_secret
https://medium.com/authpack/facebook-auth-with-node-js-c4bb90d03fc0
https://dev.to/nileshsanyal/implementing-oauth2-social-login-with-facebook-part-1-4i7l
In OAuth2, flow goes like below
1.	Client request for resource from consumer. (user visits the web page)
2.	Consumer sends a link for client to log in using facebook
e.g. https://www.facebook.com/v6.0/dialog/oauth?client_id=212634969918380&redirect_uri=http://localhost:8080/oauth/redirect&scope=email
3.	Client is redirected to facebook login page, enters credentials and accept
4.	"Service provider" redirects to redirect_url specifid in oauth url by passing a "code".
e.g. http://localhost:8080/?code=AQCufLxUQjj1pQrmLvECI47MPZw5ukncWGJD-eAkzDfhpyRmwLvCucbzvcgst9mY4bEu6ojS143c_X0LVt9YGADeJ6FLTuiOmfaaI8fhU4ihpTjRzTZ8NsOI_Ptghfnxun7hHq10trDIba5M9VbbspVlKbKatL7nnnIDHj6UpygU0FPy159Ofyubmo6GK7ur8AYOo31OvsDw4fzwPXMyvnOTcgn5tdstxsedCAMmX_Srhsn5ruO3tspO-N37JnWNMiF7u7yJh-dk-F0445VP2bq6DURfhPm5g5aUgbJhJe9-K1EbXATjt1qbyt7hY3YHLQxB3YDtYHiTN3nqv3WcHiS86kyt9rZLk4K0qDA3T5iW9Q#_=_
5.	 Consumer will have to request for access_token from "service provider" by using code, client_id, client_secret, [redirect_url]
e.g. https://graph.facebook.com/v6.0/oauth/access_token?client_id=212634969918380&client_secret=aaeab93c3550c5db0dbaeb50681c8581&code=AQBmJS1M7nuZQ28i11a49c57KVHG32hqae8ILyqo01dZER9WYCwIFx0OPo_yMCFxarA9kS1xCJXlEg6fBEaTQAFqjKZrZMXvBwCXkSTv39uNFh_jCq4wTXNq2zCCMf__3xOdLP1n-1tdN_31vq1R9HteFvfh6oSrSsjVI7pq8Sd4h3j_2rEwRVZGE5WoqoTH8G2nr7MrOSSmGIgya3RhNt4NfAg7tt-FK1zyDOqn_Gk3oE_d-s9jeHf4ulhEAZL5B8Q3sIpdG0l20a34eVU34Dl2cZue2grc22d-GJInHBB_pkvA1XRKCM3E8klPWvtH_o7j8Gyx7KOr79rQ_R3VP0VGdi_eHyZV11JpDeKZl6NYNA&redirect_uri=http://localhost:8080/oauth/redirect
6.	Once "Consumer" get the access_token, it can request for user detail
e.g. https://graph.facebook.com/me?access_token=EAADBYZBZCZAS6wBABvg1V7q5C1EiJj3ObchGuBT2F2SCKaiFRhY3ZA1l9ZBwkiMGZABg80ZBnwaWjgkSxFqpKBtYZAjijMZCu8ekVKsNdF0MDrqrxqpXPZAWCCJonI6Gz4uu1LoZCjReJAMRZCZCSZAlGjLYxiuADT06DiL1m5cSO8cCGLYwZDZD
7.	



Q What happens if user is not authenticated?
In case of facebook it show, usual unsucceful attempt screen and does not redirect.

Q. What happens if the user does not authorize(grants permission)at Service provider
In case of face book it redirect to redirect_url with error query params.
http://localhost:8080/oauth/redirect?error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied#_=_
