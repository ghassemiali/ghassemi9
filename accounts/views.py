from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm

def login_view(request):
   if not request.user.is_authenticated:
      if request.method == 'POST':
         form = AuthenticationForm(request=request, data=request.POST)
         if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']         
            print(username, password)
            user = authenticate(request, username=username, password=password)
            if user is not None:
               login(request, user)
               return redirect('/')

      form = AuthenticationForm()
      content = {'form': form}  
      return render(request, 'accounts/login.html', content)
   else:
      return redirect('/')


#def logout_view(request):
#    return 

def signup_view(request):
    return render(request, 'accounts/signup.html')