from django.shortcuts import render, redirect

import os, json
import time
from django.http import JsonResponse

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
	if autoriza(request):
		return render(request, 'dashboard/index.html')
	else:
		return redirect("/login")	

def login(request):
	if autoriza(request):
		return redirect("/")
	else:
		return render(request, 'dashboard/login.html')


def autoriza(request):
	try:
		if request.session["login"] == True:
			return True;
	except:
		pass	
	return False;


@csrf_exempt
def actions(request):
	if autoriza(request) or request.POST['action'] == "login":
		action = request.POST['action']
		if action == "start":
			instanceId = request.POST['instanceId']
			req=os.popen("aws ec2 start-instances --instance-ids "+instanceId).read()
		elif action == "stop":
			instanceId = request.POST['instanceId']
			req=os.popen("aws ec2 stop-instances --instance-ids "+instanceId).read()
		elif action == "remove":
			volumeId = request.POST['volumeId']
			req=os.popen("aws ec2 delete-volume --volume-id "+volumeId).read()
		elif action == "login":
			if request.POST["user"] == "admin" and request.POST["password"] == "admin":
				request.session["user"] = request.POST["user"]
				request.session["login"] = True
				context = {'login': True}
				return JsonResponse(context)
			else:
				request.session["login"] = False
				context = {'login': False}
				return JsonResponse(context)
		elif action == "logout":
			del request.session["login"]
			context = {'logout': True}
			return JsonResponse(context)	
	
@csrf_exempt
def getData(request):
	if autoriza(request):
		action = request.POST['action']
		if action == "instances":
			req=os.popen("aws ec2 describe-instances --query 'Reservations[*].Instances[*].[Tags[*].Value,[InstanceId],[InstanceType],[State.Name]]'").read()
			dados = json.loads(req)
			lista=[]
			for instance in dados:
				for key in instance:
					temp={}
					try:
						temp["name"] = (key[0][0])
					except:
						temp["name"] = ""
					temp["id"] = (key[1][0])
					temp["type"] = (key[2][0])
					temp["state"] = (key[3][0])
					lista.append(temp)
			context={
				'instances': lista,
			}
			return JsonResponse(context)
		elif action == "volumes":
			req=os.popen("aws ec2 describe-volumes --query 'Volumes[*].[Tags[].Value,[VolumeId],[Size],[VolumeType],[State],[Attachments[].State]]'").read()
			dados = json.loads(req)
			lista=[]
			for volume in dados:
				temp={}
				try:
					temp["name"] = (volume[0][0])
				except:
					temp["name"] = ""	
				temp["id"] = (volume[1][0])
				temp["size"] = (volume[2][0])
				temp["type"] = (volume[3][0])
				temp["state"] = (volume[4][0])
				try:
					temp["status"] = (volume[5][0])
				except:
					temp["status"] = ""
				lista.append(temp)
			context={
				'volumes': lista,
			}
			return JsonResponse(context)	